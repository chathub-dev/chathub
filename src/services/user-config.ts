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
        "DeepSeek-R1": "DeepSeek-R1",
        "RakutenAI-2.0-MoE": "RakutenAI-2.0-MoE",
        "Rakuten-AI-3.0-Alpha": "Rakuten-AI-3.0-Alpha",
        "RakutenAI-7B-instruct": "RakutenAI-7B-instruct",
        "DeepSeek-V3": "DeepSeek-V3",
        "RakutenAI-2.0-Mini-1.5B": "RakutenAI-2.0-Mini-1.5B",
    },
    // ベンダー特有のモデルIDを「Custom」カテゴリとして追加
    "Custom": {
        // Bedrock用のGeminiモデル
        "Google Gemini 2.5 Flash": "google/gemini-2.5-flash-preview-04-17",
        "Google Gemini 2.5 Pro": "google/gemini-2.5-pro-preview-05-06",
        // Bedrock用のClaudeモデル
        "Claude Sonnet 4 (Bedrock)": "us.anthropic.claude-sonnet-4-20250514-v1:0",
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
  Perplexity = 'perplexity', // For Perplexity API
  VertexAI_Claude = 'vertexai-claude' // For Google VertexAI Claude API
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
  enabled?: boolean, // 各チャットボットの有効/無効状態
  isHostFullPath?: boolean; // hostが完全なパスかどうかを示すフラグ (デフォルト: false)
}

/**
 * デフォルトのカスタムAPI設定
 */
const defaultCustomApiConfigs: CustomApiConfig[] = [
  {
    id: 1,
    name: 'Custom Ai1',
    shortName: 'o4-mi',
    model: 'o4-mini',
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
    model: MODEL_LIST.OpenAI["GPT-4.1"],
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
    model: MODEL_LIST.Anthropic["Claude Sonnet 4"],
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
    model: MODEL_LIST.Google["Gemini 2.5 Pro"],
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
  isCustomApiHostFullPath: false, // デフォルト値を設定
}

export type UserConfig = typeof userConfigWithDefaultValue



/**
 * ユーザー設定を取得する
 * @returns ユーザー設定
 */
// Helper function to migrate customApiConfigs from sync to local
async function _migrateCustomApiConfigsFromSyncToLocal(): Promise<CustomApiConfig[] | undefined> {
  const allSyncDataForMigration = await Browser.storage.sync.get(null);
  const oldIndividualConfigKeys = Object.keys(allSyncDataForMigration)
    .filter(key => key.startsWith(CUSTOM_API_CONFIG_PREFIX));

  if (oldIndividualConfigKeys.length > 0) {
    console.log('Migrating customApiConfigs from sync (individual keys) to local (single key)...');
    let migratedConfigs: CustomApiConfig[] = [];
    for (const key of oldIndividualConfigKeys) {
      if (allSyncDataForMigration[key] && typeof allSyncDataForMigration[key] === 'object') {
        migratedConfigs.push(allSyncDataForMigration[key] as CustomApiConfig);
      }
    }
    // Sort by index extracted from the key
    migratedConfigs.sort((a, b) => {
      const getIndexFromKey = (config: CustomApiConfig, keyPrefix: string, allData: Record<string, any>): number => {
        for (const k in allData) {
          if (allData[k] === config && k.startsWith(keyPrefix)) {
            const indexStr = k.substring(keyPrefix.length);
            const index = parseInt(indexStr, 10);
            if (!isNaN(index)) return index;
          }
        }
        return Infinity;
      };
      const indexA = getIndexFromKey(a, CUSTOM_API_CONFIG_PREFIX, allSyncDataForMigration);
      const indexB = getIndexFromKey(b, CUSTOM_API_CONFIG_PREFIX, allSyncDataForMigration);
      return indexA - indexB;
    });

    await Browser.storage.local.set({ customApiConfigs: migratedConfigs });
    await Browser.storage.sync.remove(oldIndividualConfigKeys);
    console.log('Migration complete.');
    return migratedConfigs;
  }
  return undefined;
}

export async function getUserConfig(): Promise<UserConfig> {
  try {
    // 1. customApiConfigs を local から取得
    const localData = await Browser.storage.local.get('customApiConfigs');
    let customConfigsInLocal: CustomApiConfig[] | undefined = localData.customApiConfigs;

    // 2. その他の設定を sync から取得 (customApiConfigs を除く)
    const syncKeysToGet = Object.keys(userConfigWithDefaultValue).filter(k => k !== 'customApiConfigs');
    const syncData = await Browser.storage.sync.get(syncKeysToGet);

    let finalConfig = defaults({}, syncData, userConfigWithDefaultValue);

    // 3. マイグレーション処理 (必要な場合)
    if (customConfigsInLocal === undefined || (Array.isArray(customConfigsInLocal) && customConfigsInLocal.length === 0)) {
      const migrated = await _migrateCustomApiConfigsFromSyncToLocal();
      if (migrated) {
        customConfigsInLocal = migrated;
      }
    }

    finalConfig.customApiConfigs = customConfigsInLocal || [...defaultCustomApiConfigs];
    
    if (finalConfig.customApiConfigs) {
      finalConfig.customApiConfigs.forEach((config: CustomApiConfig) => {
        if (config.provider === undefined) {
          config.provider = CustomApiProvider.OpenAI;
        }
        if (config.isHostFullPath === undefined) {
          config.isHostFullPath = false; // マイグレーション: 既存設定にデフォルト値を設定
        }
      });
    }
    
    if (syncData.enabledBots && Array.isArray(syncData.enabledBots) && finalConfig.customApiConfigs) {
        finalConfig.customApiConfigs.forEach((config: CustomApiConfig, index: number) => {
        if (config.enabled === undefined) {
          config.enabled = syncData.enabledBots.includes(index);
        }
      });
      await Browser.storage.sync.remove('enabledBots');
    }
    
    if (finalConfig.hasOwnProperty('useCustomChatbotOnly')) {
        delete (finalConfig as any).useCustomChatbotOnly;
        await Browser.storage.sync.remove('useCustomChatbotOnly');
    }

    return finalConfig;
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
    const { customApiConfigs, ...otherUpdates } = updates;

    // 1. customApiConfigs を local に保存 (存在する場合)
    if (customApiConfigs !== undefined) { // null や空配列も保存対象とするため、undefined のみチェック
      if (Array.isArray(customApiConfigs)) {
        const limitedConfigs = customApiConfigs.slice(0, MAX_CUSTOM_MODELS);
        await Browser.storage.local.set({ customApiConfigs: limitedConfigs });
      } else {
        // customApiConfigs が配列でない不正なケース (例: null)
        await Browser.storage.local.set({ customApiConfigs: [] }); // 空配列として保存
      }
    }

    // 2. その他の設定を sync に保存 (存在する場合)
    if (Object.keys(otherUpdates).length > 0) {
      const updatesForSync: Record<string, any> = {};
      const keysToRemoveFromSync: string[] = [];

      for (const [key, value] of Object.entries(otherUpdates)) {
        if (value === undefined) {
          keysToRemoveFromSync.push(key);
        } else {
          updatesForSync[key] = value;
        }
      }
      if (Object.keys(updatesForSync).length > 0) {
        await Browser.storage.sync.set(updatesForSync);
      }
      if (keysToRemoveFromSync.length > 0) {
        await Browser.storage.sync.remove(keysToRemoveFromSync);
      }
    }
    

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

