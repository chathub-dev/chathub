import React from 'react';

// Anthropicロゴのパス
const ANTHROPIC_LOGO_PATH = "M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z";

// スタイル情報の型定義
interface StyleInfo {
  bgColor?: string;
  shape?: 'circle' | 'square';
  iconColor: string;
  hasBg: boolean;
}

// カラーバリエーションのマッピング
export const ANTHROPIC_STYLES: Record<string, StyleInfo> = {
  'purple': { bgColor: '#8C60EA', shape: 'circle', iconColor: '#ffffff', hasBg: true },
  'purple-square': { bgColor: '#8C60EA', shape: 'square', iconColor: '#ffffff', hasBg: true },
  'black': { bgColor: '#000000', shape: 'circle', iconColor: '#ffffff', hasBg: true },
  'black-square': { bgColor: '#000000', shape: 'square', iconColor: '#ffffff', hasBg: true },
  'simple': { iconColor: '#8C60EA', hasBg: false },
};

// Anthropicアイコンコンポーネント
interface AnthropicLogoProps {
  size?: number;
  style?: string; // 'purple', 'purple-square', 'simple'
  className?: string;
}

const AnthropicLogo: React.FC<AnthropicLogoProps> = ({ size = 64, style = 'purple', className = '' }) => {
  // スタイル名を正規化して対応するスタイル情報を取得
  let normalizedStyle = style?.toLowerCase() || 'purple';
  
  // 特別な場合の処理（"square"が含まれる場合）
  if (normalizedStyle.includes('square') && !normalizedStyle.includes('-square')) {
    const baseStyle = normalizedStyle.replace('square', '').trim();
    normalizedStyle = `${baseStyle}-square`;
  }
  
  const styleInfo = ANTHROPIC_STYLES[normalizedStyle] || ANTHROPIC_STYLES.purple;
  const { bgColor, shape, iconColor, hasBg } = styleInfo;
  
  // アイコンのサイズ（背景ありの場合は背景の75%、背景なしの場合は指定サイズ）
  const iconSize = hasBg ? size * 0.75 : size;
  
  // 背景なしの場合はSVGのみ返す
  if (!hasBg) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={iconColor}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Anthropic</title>
          <path d={ANTHROPIC_LOGO_PATH} />
        </svg>
      </div>
    );
  }
  
  // 背景ありのロゴコンポーネントを返す
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderRadius: shape === 'circle' ? '50%' : '6px',
        color: iconColor,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Anthropic</title>
        <path d={ANTHROPIC_LOGO_PATH} />
      </svg>
    </div>
  );
};

export default AnthropicLogo;