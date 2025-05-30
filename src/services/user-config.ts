import { defaults } from 'lodash-es'
import toast from 'react-hot-toast';
import Browser from 'webextension-polyfill'
import {
  ALL_IN_ONE_PAGE_ID, CHATGPT_API_MODELS, DEFAULT_CHATGPT_SYSTEM_MESSAGE, DEFAULT_CLAUDE_SYSTEM_MESSAGE,
  CHATBOTS_UPDATED_EVENT
} from '~app/consts'

// カスタムモデルの最大数
const MAX_CUSTOM_MODELS = 50;

// カスタムAPIの設定キーのプレフィックス
const CUSTOM_API_CONFIG_PREFIX = 'customApiConfig_';


// モデルリストをプロバイダーごとに階層化
// Explicitly type MODEL_LIST to ensure values are strings
export const MODEL_LIST: Record<string, Record<string, string>> = {
    "OpenAI": {
        "GPT-4.1": "gpt-4.1", // Default to current best
        "GPT-4.1 mini": "gpt-4.1-mini",
        "o4-mini": "o4-mini",
        "o3": "o3",
    },
    "Anthropic": {
        "Claude Sonnet 4": "claude-sonnet-4-0",
        "Claude Opus 4": "claude-opus-4-0",
        "Claude Sonnet 3.7": "claude-3-7-sonnet-latest",
        "Claude Haiku 3.5": "claude-3-5-haiku-latest",
    },
    "Google": {
        "Gemini 2.5 Pro": "gemini-2.5-pro-preview-05-06",
        "Gemini 2.5 Flash": "gemini-2.5-flash-preview-04-17",
    },
    "Grok": {
        "Grok 3": "grok-3",
        "Grok 3 Fast": "grok-3-fast",
        "Grok 3 Mini": "grok-3-mini",
        "Grok 3 Mini Fast": "grok-3-mini-fast",
    },
    "Deepseek": {
        "Deepseek Chat": "deepseek-chat",
        "Deepseek Reasoner": "deepseek-reasoner",
    },
    "Perplexity": {
        "Sonar Pro": "sonar-pro",
        "Sonar": "sonar",
        "Sonar Deep Research": "sonar-deep-research",
        "Sonar Reasoning Pro": "sonar-reasoning-pro",
        "Sonar Reasoning": "sonar-reasoning",
        "R1-1776 (Offline)": "r1-1776",
    },
    "Rakuten": {
        "RakutenAI-2.0-MoE": "RakutenAI-2.0-MoE",
    },
    // ベンダー特有のモデルIDを「Custom」カテゴリとして追加
    "Custom": {
        // Bedrock用のGeminiモデル
        "Google Gemini 2.5 Flash": "google/gemini-2.5-flash-preview-04-17",
        "Google Gemini 2.5 Pro": "google/gemini-2.5-pro-preview-05-06",
        // Bedrock用のClaudeモデル
        "Claude 3.7 Sonnet (Bedrock)": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        "Claude 3.5 Haiku (Bedrock)": "anthropic.claude-3-5-haiku-20241022-v1:0",
    },
};
// Note: Removed individual model enums (ClaudeAPIModel, GeminiAPIModel, etc.) and CustomAPIModel enum



// テンプレートの種類を定義
export enum TemplateType {
  None = 'none',
  OpenAI = 'openai',
  Claude = 'claude',
  Gemini = 'gemini',
  Perplexity = 'perplexity',
  Grok = 'grok'
}

export enum CustomApiProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic', // Default, uses x-api-key
  Bedrock = 'bedrock',
  Anthropic_CustomAuth = 'anthropic-customauth', // Uses Authorization header
  Google = 'google', // For Gemini API
  Perplexity = 'perplexity' // For Perplexity API
}

/**
 * カスタムAPIの設定インターフェース
 * カスタムAPIの設定情報を保持する型定義
 */
export interface CustomApiConfig {
  id?: number // 未使用、後方互換性のため維持。
  name: string,
  shortName: string,
  host: string,
  model: string,
  temperature: number,
  systemMessage: string,
  avatar: string,
  apiKey: string,
  thinkingMode: boolean,
  thinkingBudget: number,
  provider: CustomApiProvider,
  webAccess?: boolean,
  isAnthropicUsingAuthorizationHeader?: boolean, // Anthropicの認証ヘッダータイプを指定するフラグ
  enabled?: boolean // 各チャットボットの有効/無効状態
}

/**
 * デフォルトのカスタムAPI設定
 */
const defaultCustomApiConfigs: CustomApiConfig[] = [
  {
    id: 1,
    name: 'Custom Ai1',
    shortName: 'o3-mi',
    model: 'o3-mini',
    host: '',
    temperature: 0.7,
    systemMessage: '',
    avatar: 'OpenAI.SimpleBlack',
    apiKey: '',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.OpenAI,
    webAccess: false, // デフォルトは無効
    enabled: true // 
  },
  {
    id: 2,
    name: 'Custom Ai2',
    shortName: 'o1',
    model: 'o1',
    host: '',
    temperature: 1.0,
    systemMessage: '',
    avatar: 'OpenAI.SimpleGreen',
    apiKey: '',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.OpenAI,
    webAccess: false, // デフォルトは無効
    enabled: true // 
  },
  {
    id: 3,
    name: 'Custom Ai3',
    shortName: 'LessT',
    model: 'o3-mini',
    host: '',
    temperature: 0.2,
    systemMessage: '',
    avatar: 'OpenAI.SimpleYellow',
    apiKey: '',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.OpenAI,
    webAccess: false, // デフォルトは無効
    enabled: true // 
  },
  {
    id: 4,
    name: 'Custom Ai4',
    shortName: 'rand',
    model: 'o3-mini',
    host: '',
    temperature: 2.0,
    systemMessage: '',
    avatar: 'OpenAI.SimplePurple',
    apiKey: '',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.OpenAI,
    webAccess: false, // デフォルトは無効
    enabled: true
  }
]


// Define presets for API models only | Template
/**
 * APIモデルのプリセット設定
 */
export const presetApiConfigs: Record<string, Omit<CustomApiConfig, 'id' | 'apiKey'>> = {
  "OpenAI": {
    name: 'OpenAI',
    shortName: "GPT",
    model: MODEL_LIST.OpenAI["GPT-4.1"], // Ensure this is the intended default
    host: 'https://api.openai.com',
    temperature: 1,
    systemMessage: DEFAULT_CHATGPT_SYSTEM_MESSAGE,
    avatar: 'OpenAI.Green',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.OpenAI
  },
  "Anthropic": {
    name: 'Anthropic',
    shortName: "Claud",
    model: MODEL_LIST.Anthropic["Claude Sonnet 3.7"], // 正しいモデル名に修正
    host: 'https://api.anthropic.com/',
    temperature: 1.0,
    systemMessage: DEFAULT_CLAUDE_SYSTEM_MESSAGE,
    avatar: 'Claude.Orange',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.Anthropic
  },
  "Gemini": {
    name: 'Google Gemini',
    shortName: "GGem",
    model: MODEL_LIST.Google["Gemini 2.5 Pro"], // Ensure this is the intended default
    host: '',
    temperature: 1.0,
    systemMessage: DEFAULT_CHATGPT_SYSTEM_MESSAGE,
    avatar: 'Gemini.Color',
    thinkingMode: false,
    thinkingBudget: 2000,
    provider: CustomApiProvider.Google
  },
   "Perplexity": {
     name: 'Perplexity',
     shortName: "pplx",
     model: MODEL_LIST.Perplexity["Sonar Pro"], // Set default Perplexity model from MODEL_LIST
     host: 'https://api.perplexity.ai',
     temperature: 1.0,
     systemMessage: '', // Keep system message empty or set a default if needed
     avatar: 'Perplexity.Sonar',
     thinkingMode: false,
     thinkingBudget: 2000,
     provider: CustomApiProvider.Perplexity // Ensure Perplexity provider exists and is correct
  },
  "Grok": {
     name: 'Grok',
     shortName: 'Grok',
     model: MODEL_LIST.Grok["Grok 3"], // Ensure this is the intended default
     host: 'https://api.x.ai/v1', // Verify Grok API host
     temperature: 1.0,
     systemMessage: '', // Keep system message empty or set a default if needed
     avatar: 'grok', // Ensure 'grok' avatar exists
     thinkingMode: false,
     thinkingBudget: 2000,
     provider: CustomApiProvider.OpenAI // Grok uses OpenAI compatible API, keep this provider
  },

};
// Note: 'id', 'shortName', 'apiKey', and potentially 'host' for Bedrock/Gemini need user input or further setup.




/**
 * デフォルトのユーザー設定
 */
const userConfigWithDefaultValue = {
  startupPage: ALL_IN_ONE_PAGE_ID,
  chatgptWebAccess: false,
  claudeWebAccess: false,
  customApiConfigs: defaultCustomApiConfigs,
  customApiKey: '',
  customApiHost: '',
}

export type UserConfig = typeof userConfigWithDefaultValue



/**
 * ユーザー設定を取得する
 * @returns ユーザー設定
 */
export async function getUserConfig(): Promise<UserConfig> {
  try {
    const result = await Browser.storage.sync.get(null) // 全ての設定を取得
    
    let configs: CustomApiConfig[] = [];

    // customApiConfig_XXXから個数を取得
    const configKeys = Object.keys(result).filter(key => key.startsWith(CUSTOM_API_CONFIG_PREFIX));
    
    // 存在するcustomApiConfig_XXXでループする
    for (const key of configKeys) {
      const customApiConfigFromStorage = result[key] as CustomApiConfig;
      if (customApiConfigFromStorage) {
        configs.push(customApiConfigFromStorage);
      }
    }
    
    // インデックス順にソート
    configs.sort((a, b) => {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return idA - idB;
    });
    
    result.customApiConfigs = configs;

    if (result.customApiConfigs && result.customApiConfigs.length > 0) {
      const defaultCount = defaultCustomApiConfigs.length;
      const currentCount = result.customApiConfigs.length;

      // 既存の設定にproviderフィールドがない場合は追加
      result.customApiConfigs.forEach((config: CustomApiConfig) => {
        if (config.provider === undefined) {
          config.provider = CustomApiProvider.OpenAI;
        }
      });

      // 最低限のデフォルト設定を確保
      if (currentCount < defaultCount) {
        const configsToAdd = defaultCustomApiConfigs.slice(currentCount, defaultCount);
        result.customApiConfigs.push(...configsToAdd);
      }
    } else {
      result.customApiConfigs = [...defaultCustomApiConfigs]; // 初めて設定されている場合
    }

    // enabledBotsからenabledプロパティへのマイグレーション
    if (result.enabledBots && Array.isArray(result.enabledBots)) {
      result.customApiConfigs.forEach((config: CustomApiConfig, index: number) => {
        // enabledプロパティが未定義の場合のみマイグレーション
        if (config.enabled === undefined) {
          config.enabled = result.enabledBots.includes(index);
        }
      });
    }
    
    // useCustomChatbotOnly フラグを削除（すべてカスタムモデルとして扱う）
    delete result.useCustomChatbotOnly;
    
    return defaults(result, userConfigWithDefaultValue);
  } catch (error) {
    console.error('Failed to get user config:', error);
    toast.error('設定の読み込みに失敗しました。デフォルト設定を使用します。');
    return { ...userConfigWithDefaultValue };
  }
}


/**
 * ユーザー設定を更新する
 * @param updates 更新する設定
 */
export async function updateUserConfig(updates: Partial<UserConfig>) {
  try {
    // customApiConfigsが含まれている場合は、個別キーに変換して保存
    if ('customApiConfigs' in updates) {
      const configs = updates.customApiConfigs;
      
      if (configs) {
        // 上限数を考慮
        const limitedConfigs = configs.slice(0, MAX_CUSTOM_MODELS);
        
        // 既存のカスタム設定キーを削除
        const allKeys = await Browser.storage.sync.get(null);
        const existingConfigKeys = Object.keys(allKeys)
          .filter(key => key.startsWith(CUSTOM_API_CONFIG_PREFIX));
        
        if (existingConfigKeys.length > 0) {
          await Browser.storage.sync.remove(existingConfigKeys);
        }
        
        // 各モデルを個別に保存
        for (let i = 0; i < limitedConfigs.length; i++) {
          await Browser.storage.sync.set({ [`${CUSTOM_API_CONFIG_PREFIX}${i}`]: limitedConfigs[i] });
        }
      }
      
      // updates から customApiConfigs を削除（他の更新に含めない）
      delete updates.customApiConfigs;
    }
    
    // その他の更新
    if (Object.keys(updates).length > 0) {
      await Browser.storage.sync.set(updates);
      
      // undefined値のキーを削除
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          await Browser.storage.sync.remove(key);
        }
      }
    }
    
    // 設定更新イベントを発火
    const event = new CustomEvent(CHATBOTS_UPDATED_EVENT);
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Failed to update user config:', error);
    let errorMessage = '設定の保存に失敗しました';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    toast.error(errorMessage);
  }
}

/**
 * 全てのカスタム設定を削除する
 */
export async function clearAllCustomConfigs(): Promise<void> {
  try {
    const allKeys = await Browser.storage.sync.get(null);
    const configKeys = Object.keys(allKeys)
      .filter(key => key.startsWith(CUSTOM_API_CONFIG_PREFIX));
    
    if (configKeys.length > 0) {
      await Browser.storage.sync.remove(configKeys);
      toast.success('全てのカスタム設定を削除しました');
    }
  } catch (error) {
    console.error('Failed to clear custom configs:', error);
    let errorMessage = 'カスタム設定の削除に失敗しました';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    toast.error(errorMessage);
  }
}
