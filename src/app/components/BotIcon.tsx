import React, { memo } from 'react';
import OpenAILogo from './logos/OpenAILogos';
import ClaudeLogo from './logos/ClaudeLogos';
import PerplexityLogo from './logos/PerplexityLogos';

// =====================================================================================
// IMPORTANT: アイコン追加・変更時の注意
// =====================================================================================
// 新しいアイコンをここに追加する場合、必ず以下のファイルにも同様の変更を加えてください:
//   - src/app/components/Settings/IconSelect.tsx (otherIcons 配列の更新)
//
// =====================================================================================

// アイコンのインポート
import claudeLogo from '~/assets/logos/anthropic.png';
import baichuanLogo from '~/assets/logos/baichuan.png';
import bardLogo from '~/assets/logos/bard.svg';
import bingLogo from '~/assets/logos/bing.svg';
import chatglmLogo from '~/assets/logos/chatglm.svg';
import chatgptLogo from '~/assets/logos/chatgpt.svg';
import falconLogo from '~/assets/logos/falcon.jpeg';
import geminiLogo from '~/assets/logos/gemini.svg';
import grokLogo from '~/assets/logos/grok.png';
import llamaLogo from '~/assets/logos/llama.png';
import mistralLogo from '~/assets/logos/mistral.png';
import piLogo from '~/assets/logos/pi.png';
import qianwenLogo from '~/assets/logos/qianwen.png';
import rakutenLogo from '~/assets/logos/rakuten.svg';
import vicunaLogo from '~/assets/logos/vicuna.jpg';
import wizardlmLogo from '~/assets/logos/wizardlm.png';
import xunfeiLogo from '~/assets/logos/xunfei.png';
import yiLogo from '~/assets/logos/yi.svg';
import chathubLogo from '~/assets/logos/chathub.svg';
import alpacaLogo from '~/assets/logos/alpaca.png';
import deepseekLogo from '~/assets/logos/deepseek.svg';
import dollyLogo from '~/assets/logos/dolly.png';
import guanacoLogo from '~/assets/logos/guanaco.png';
import hyperbolicLogo from '~/assets/logos/hyperbolic.svg';
import koalaLogo from '~/assets/logos/koala.jpg';
import oasstLogo from '~/assets/logos/oasst.svg';
import rwkvLogo from '~/assets/logos/rwkv.png';
import stablelmLogo from '~/assets/logos/stablelm.png';
import sambaNovaLogo from '~/assets/logos/SambaNova.svg';
import huddleLLMLogo from '~/assets/logos/HuddleLLM.png';
import claude4Logo from '~/assets/logos/Claude4.webp';
import deepinfraLogo from '~/assets/logos/deepinfra.svg';

// 特殊フォーマットのアイコンID用マッピング
const specialFormatMap: Record<string, string> = {
  'Anthropic.Color': claudeLogo,
  'Claude.Claude4': claude4Logo,
  'Gemini.Color': geminiLogo,
  'Llama.Color': llamaLogo,
  'Mistral.Color': mistralLogo,
  'Bing.Color': bingLogo,
  'Bard.Color': bardLogo
};

// アイコン名からイメージへのマッピング
const iconMap: Record<string, string> = {
  'anthropic': claudeLogo,
  'claude': claudeLogo,
  'claude4': claude4Logo,
  'baichuan': baichuanLogo,
  'bard': bardLogo,
  'bing': bingLogo,
  'chatglm': chatglmLogo,
  'chatgpt': chatgptLogo,
  'chathub': chathubLogo,
  'deepinfra': deepinfraLogo,
  'deepseek': deepseekLogo,
  'openai': chatgptLogo,
  'falcon': falconLogo,
  'gemini': geminiLogo,
  'gemini-png': geminiLogo,
  'grok': grokLogo,
  'llama': llamaLogo,
  'ollama': llamaLogo,
  'mistral': mistralLogo,
  'pi': piLogo,
  'qianwen': qianwenLogo,
  'rakuten': rakutenLogo,
  'vicuna': vicunaLogo,
  'wizardlm': wizardlmLogo,
  'xunfei': xunfeiLogo,
  'yi': yiLogo,
  'alpaca': alpacaLogo,
  'dolly': dollyLogo,
  'guanaco': guanacoLogo,
  'hyperbolic': hyperbolicLogo,
  'koala': koalaLogo,
  'oasst': oasstLogo,
  'rwkv': rwkvLogo,
  'stablelm': stablelmLogo,
  'sambanova': sambaNovaLogo,
  'huddlellm': huddleLLMLogo,
};

// 安全なアイコン表示のための検証関数
const isValidIcon = (icon: string | undefined | null): boolean => {
  if (!icon) return false;
  
  // OpenAIスタイルのアイコン
  if (icon.startsWith('OpenAI.')) {
    const style = icon.split('.')[1]?.toLowerCase();
    return [
      'black', 'green', 'purple', 'yellow', 'blacksquare', 'square',
      'simpleblack', 'simplegreen', 'simplepurple', 'simpleyellow'
    ].includes(style || '');
  }

  // Claudeスタイルのアイコン
  if (icon.startsWith('Claude.')) {
    const style = icon.split('.')[1]?.toLowerCase();
    return ['orange', 'simple', 'simpleblack', 'square', 'orangesquare', 'claude4', 'claude4circle', 'claude4square'].includes(style || '');
  }

  // Perplexityスタイルのアイコン
  if (icon.startsWith('Perplexity.')) {
    const style = icon.split('.')[1]?.toLowerCase();
    return ['color', 'mono', 'sonar', 'square'].includes(style || '');
  }
  
  // URLまたはデータURI
  if (icon.startsWith('http') || icon.startsWith('data:')) return true;
  
  // 既知のアイコン
  return Object.keys(iconMap).some(key => icon.toLowerCase().includes(key));
};

interface BotIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

/**
 * BotIconコンポーネント - ボットアイコンを表示
 *
 * 以下の形式をサポート：
 * - URLまたはデータURI（直接画像を表示）
 * - 'OpenAI.{style}'形式（例：'OpenAI.Black'）- スタイル付きOpenAIアイコン
 * - 'provider.variant'形式（例：'Claude.Color'）- 従来のアイコンから対応するものを探す
 * - プロバイダ名のみ（例：'chatgpt'）- 従来のアイコンを表示
 */
const BotIcon: React.FC<BotIconProps> = ({ iconName, size = 24, className = '' }) => {
  try {
    // URLまたはデータURIの場合は画像として表示
    if (iconName && (iconName.startsWith('http') || iconName.startsWith('data:') || iconName.includes('assets'))) {
      return (
        <img
          src={iconName}
          alt="Bot Icon"
          style={{ width: size, height: size, objectFit: 'contain' }}
          className={className}
        />
      );
    }
    
    // アイコン名が無効な場合はデフォルトのChatHubロゴを使用
    if (!iconName || typeof iconName !== 'string') {
      return (
        <img
          src={chathubLogo}
          alt="ChatHub"
          style={{ width: size, height: size, objectFit: 'contain' }}
          className={className}
        />
      );
    }

    // OpenAIの特殊スタイルを処理
    if (iconName.startsWith('OpenAI.')) {
      const style = iconName.split('.')[1]?.toLowerCase();
      
      // スタイル名をOpenAIStylesの形式に変換
     let openAIStyle = 'black'; // デフォルト
     
     if (style === 'black') openAIStyle = 'black';
     else if (style === 'green') openAIStyle = 'green';
     else if (style === 'purple') openAIStyle = 'purple';
     else if (style === 'yellow') openAIStyle = 'yellow';
     else if (style === 'blacksquare' || style === 'square') openAIStyle = 'black-square';
     else if (style === 'simpleblack') openAIStyle = 'simple-black';
     else if (style === 'simplegreen') openAIStyle = 'simple-green';
     else if (style === 'simplepurple') openAIStyle = 'simple-purple';
     else if (style === 'simpleyellow') openAIStyle = 'simple-yellow';
      
      // サーバーサイドレンダリングの場合など、OpenAILogoが使えない環境ではfallback
      if (typeof window === 'undefined' || !OpenAILogo) {
        return (
          <img
            src={chatgptLogo}
            alt="OpenAI"
            style={{ width: size, height: size, objectFit: 'contain' }}
            className={className}
          />
        );
      }
      
      return <OpenAILogo size={size} style={openAIStyle} className={className} />;
    }

    // Claudeの特殊スタイルを処理
    if (iconName.startsWith('Claude.')) {
      const style = iconName.split('.')[1]?.toLowerCase();
      
      // スタイル名をClaudeStylesの形式に変換
      let claudeStyle = 'orange'; // デフォルト
      
      if (style === 'orange') claudeStyle = 'orange';
      else if (style === 'simple') claudeStyle = 'simple';
      else if (style === 'simpleblack') claudeStyle = 'simple-black';
      else if (style === 'square' || style === 'orangesquare') claudeStyle = 'orange-square';
      else if (style === 'claude4') claudeStyle = 'claude4';
      else if (style === 'claude4circle') claudeStyle = 'claude4-circle';
      else if (style === 'claude4square') claudeStyle = 'claude4-square';
      
      // サーバーサイドレンダリングの場合など、ClaudeLogoが使えない環境ではfallback
      if (typeof window === 'undefined' || !ClaudeLogo) {
        return (
          <img
            src={claudeLogo}
            alt="Claude"
            style={{ width: size, height: size, objectFit: 'contain' }}
            className={className}
          />
        );
      }
      
      return <ClaudeLogo size={size} style={claudeStyle} className={className} />;
    }

    // Perplexityの特殊スタイルを処理
    if (iconName.startsWith('Perplexity.')) {
      const style = iconName.split('.')[1]?.toLowerCase();
      
      if (['sonar', 'color', 'mono', 'square'].includes(style)) {
        // サーバーサイドレンダリングの場合など、PerplexityLogoが使えない環境ではfallback
        if (typeof window === 'undefined' || !PerplexityLogo) {
          return (
            <img
              src={chatgptLogo}
              alt="Perplexity"
              style={{ width: size, height: size, objectFit: 'contain' }}
              className={className}
            />
          );
        }
        
        return <PerplexityLogo size={size} style={style as 'color' | 'mono' | 'sonar' | 'square'} className={className} />;
      }
      
      // その他の場合はデフォルトのアイコンを使用
      return <PerplexityLogo size={size} style={'color'} className={className} />;
    }

    // 特殊フォーマット ID を直接チェック（例：'Anthropic.Color'）
    if (specialFormatMap[iconName]) {
      return (
        <img
          src={specialFormatMap[iconName]}
          alt={iconName}
          style={{ width: size, height: size, objectFit: 'contain' }}
          className={className}
          title={iconName}
        />
      );
    }

    // 'provider.variant'形式を処理（例：'Claude.Color'）
    // variantは無視して、providerだけをキーとして使用
    let provider = iconName;
    if (iconName.includes('.')) {
      provider = iconName.split('.')[0].toLowerCase();
    }
    
    // 対応するアイコンを検索
    const icon = Object.entries(iconMap).find(
      ([key]) => provider.toLowerCase().includes(key.toLowerCase())
    );
    
    // アイコンが見つかった場合は表示、見つからなかった場合はデフォルトアイコン
    if (icon) {
      return (
        <img
          src={icon[1]}
          alt={provider}
          style={{ width: size, height: size, objectFit: 'contain' }}
          className={className}
          title={iconName}
        />
      );
    }

    // どのアイコンにも一致しない場合はデフォルトアイコンを表示
    return (
      <img
        src={chatgptLogo}
        alt="Default"
        style={{ width: size, height: size, objectFit: 'contain' }}
        className={className}
        title={iconName}
      />
    );
  } catch (error) {
    console.error("Error in BotIcon rendering:", error);
    // エラー時は常にデフォルトアイコンを表示
    return (
      <img
        src={chathubLogo}
        alt="Error"
        style={{ width: size, height: size, objectFit: 'contain' }}
        className={className}
      />
    );
  }
};

export default memo(BotIcon);
