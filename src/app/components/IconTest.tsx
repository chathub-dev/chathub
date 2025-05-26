import React, { useState } from 'react';
import BotIcon from './BotIcon';
import IconSelect from './Settings/IconSelect';
import { Input } from './Input';
import OpenAILogo from './logos/OpenAILogos';
import ClaudeLogo from './logos/ClaudeLogos';
import AnthropicLogo from './logos/AnthropicLogos';
import PerplexityLogo from './logos/PerplexityLogos';

const IconTest: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState('OpenAI.Black');
  const [customIconUrl, setCustomIconUrl] = useState('');
  
  const handleCustomIconApply = () => {
    if (customIconUrl) {
      setSelectedIcon(customIconUrl);
    }
  };

  // OpenAIのアイコンバリエーション
  const openAIVariants = [
    { name: 'Black', value: 'OpenAI.Black' },
    { name: 'Green', value: 'OpenAI.Green' },
    { name: 'Purple', value: 'OpenAI.Purple' },
    { name: 'Yellow', value: 'OpenAI.Yellow' },
    { name: 'Square', value: 'OpenAI.BlackSquare' },
  ];
  
  // Claudeのアイコンバリエーション
  const claudeVariants = [
    { name: 'Orange', value: 'Claude.Orange' },
    { name: 'Orange Square', value: 'Claude.OrangeSquare' },
    { name: 'Purple', value: 'Claude.Purple' },
    { name: 'Purple Square', value: 'Claude.PurpleSquare' },
    { name: 'Black', value: 'Claude.Black' },
  ];
  
  // Anthropicのアイコンバリエーション
  const anthropicVariants = [
    { name: 'Purple', value: 'Anthropic.Purple' },
    { name: 'Black', value: 'Anthropic.Black' },
    { name: 'Blue', value: 'Anthropic.Blue' },
    { name: 'Purple Square', value: 'Anthropic.PurpleSquare' },
    { name: 'Black Square', value: 'Anthropic.BlackSquare' },
    { name: 'Blue Square', value: 'Anthropic.BlueSquare' },
  ];

  // Perplexityのアイコンバリエーション
  const perplexityVariants = [
    { name: 'Color', value: 'Perplexity.Color' },
    { name: 'Square', value: 'Perplexity.Square' },
    { name: 'Mono', value: 'Perplexity.Mono' },
    { name: 'Sonar', value: 'Perplexity.Sonar' },
  ];
  
  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">アイコンテスト</h1>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">現在選択中のアイコン:</h2>
        <div className="flex items-center gap-4 p-4 border rounded">
          <BotIcon iconName={selectedIcon} size={64} />
          <div>
            <div className="font-medium">アイコン名: {selectedIcon}</div>
            <div className="text-gray-500 text-sm">
              大きさのバリエーション:
              <div className="flex gap-2 mt-2">
                <BotIcon iconName={selectedIcon} size={16} />
                <BotIcon iconName={selectedIcon} size={24} />
                <BotIcon iconName={selectedIcon} size={32} />
                <BotIcon iconName={selectedIcon} size={48} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* OpenAIアイコンのバリエーション */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl mb-2">OpenAI アイコンバリエーション</h2>
        <div className="grid grid-cols-5 gap-4">
          {openAIVariants.map(variant => (
            <div
              key={variant.value}
              className={`flex flex-col items-center gap-2 p-3 border rounded cursor-pointer ${
                selectedIcon === variant.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIcon(variant.value)}
            >
              <BotIcon iconName={variant.value} size={48} />
              <span className="text-sm">{variant.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Claudeアイコンのバリエーション */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl mb-2">Claude アイコンバリエーション</h2>
        <div className="grid grid-cols-5 gap-4">
          {claudeVariants.map(variant => (
            <div
              key={variant.value}
              className={`flex flex-col items-center gap-2 p-3 border rounded cursor-pointer ${
                selectedIcon === variant.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIcon(variant.value)}
            >
              <BotIcon iconName={variant.value} size={48} />
              <span className="text-sm">{variant.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Anthropicアイコンのバリエーション */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl mb-2">Anthropic アイコンバリエーション</h2>
        <div className="grid grid-cols-6 gap-4">
          {anthropicVariants.map(variant => (
            <div
              key={variant.value}
              className={`flex flex-col items-center gap-2 p-3 border rounded cursor-pointer ${
                selectedIcon === variant.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIcon(variant.value)}
            >
              <BotIcon iconName={variant.value} size={48} />
              <span className="text-sm">{variant.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* カスタムアイコンURL入力 */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl mb-2">カスタム画像URL:</h2>
        <div className="flex gap-2 items-center">
          <Input 
            className="flex-1"
            placeholder="https://example.com/icon.png"
            value={customIconUrl}
            onChange={(e) => setCustomIconUrl(e.currentTarget.value)}
          />
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleCustomIconApply}
            disabled={!customIconUrl}
          >
            適用
          </button>
        </div>
        {customIconUrl && (
          <div className="mt-2 p-2 border rounded flex justify-center">
            <BotIcon iconName={customIconUrl} size={48} />
          </div>
        )}
      </div>
      
      {/* Perplexityアイコンのバリエーション */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl mb-2">Perplexity アイコンバリエーション</h2>
        <div className="grid grid-cols-4 gap-4">
          {perplexityVariants.map(variant => (
            <div
              key={variant.value}
              className={`flex flex-col items-center gap-2 p-3 border rounded cursor-pointer ${
                selectedIcon === variant.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIcon(variant.value)}
            >
              <BotIcon iconName={variant.value} size={48} />
              <span className="text-sm">{variant.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl mb-2">アイコン選択:</h2>
        <div className="border rounded p-4">
          <IconSelect value={selectedIcon} onChange={setSelectedIcon} />
        </div>
      </div>
    </div>
  );
};

export default IconTest;
