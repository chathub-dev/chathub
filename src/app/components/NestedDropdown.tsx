import { FC, useState, useRef, useEffect } from 'react';
import { cx } from '~/utils';

// インターフェースをエクスポート
export interface NestedDropdownOption {
  label: string;
  value?: string;
  children?: NestedDropdownOption[];
  disabled?: boolean;
}

interface Props {
  options: NestedDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showModelId?: boolean;
}

const NestedDropdown: FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  showModelId = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 現在選択されている値に対応するラベルを探す
  const findSelectedLabel = (opts: NestedDropdownOption[]): string => {
    for (const option of opts) {
      if (option.value === value) {
        return option.label;
      }
      if (option.children) {
        const label = findSelectedLabel(option.children);
        if (label) return label;
      }
    }
    return '';
  };
  
  const selectedLabel = findSelectedLabel(options) || placeholder;
  
  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* トリガーボタン */}
      <button
        type="button"
        className="w-full flex items-center justify-between rounded-md bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none">
          {/* overflow-auto と max-h-60 を削除してサブメニューが表示されるようにする */}
          <div className="py-1">
            {options.map((option, idx) => (
              // group クラスを追加して、group-hover を使えるようにする
              <div key={idx} className="relative group">
                {/* メインメニュー項目 */}
                <div
                  className={cx(
                    'px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer font-medium',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {option.label}
                  {option.children && option.children.length > 0 && (
                    <span className="absolute right-2">▶</span>
                  )}
                </div>

                {/* サブメニュー（存在する場合） */}
                {option.children && option.children.length > 0 && (
                  // group-hover で表示を制御
                  <div className="absolute left-full top-0 w-full rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none hidden group-hover:block">
                    <div className="py-1">
                      {option.children.map((child, childIdx) => (
                        <div
                          key={childIdx}
                          className={cx(
                            'px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer',
                            child.value === value && 'bg-blue-100 text-blue-900 dark:bg-blue-600 dark:text-white',
                            child.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => {
                            if (!child.disabled && child.value) {
                              onChange(child.value);
                              setIsOpen(false);
                            }
                          }}
                        >
                          <div>{child.label}</div>
                          {showModelId && child.value && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{child.value}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Tailwind CSSでスタイリングするため不要 */}
    </div>
  );
};

export default NestedDropdown;
