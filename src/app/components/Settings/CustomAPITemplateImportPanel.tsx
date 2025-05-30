import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiImport } from 'react-icons/bi'
import { fileOpen } from 'browser-fs-access'
import Browser from 'webextension-polyfill'
import Button from '../Button'
import Dialog from '../Dialog'
import Select from '../Select'
import { UserConfig, CustomApiConfig, updateUserConfig } from '~services/user-config'
import toast from 'react-hot-toast'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}


const CustomAPITemplateImportPanel: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [importedConfigs, setImportedConfigs] = useState<CustomApiConfig[]>([])
  const [mappings, setMappings] = useState<number[]>([])

  // ファイル選択処理
  const handleFileSelect = async () => {
    try {
      const blob = await fileOpen({ extensions: ['.json'] })
      try {
        const text = await blob.text()
        try {
          const json = JSON.parse(text)
          
          if (!json.sync) {
            toast.error(t('Invalid file format: "sync" property not found'))
            return
          }
          
          // カスタムAPI設定の抽出
          let importedConfigs: CustomApiConfig[] = []
          
          try {
            // 新しい形式（配列）で保存されているか確認
            if (Array.isArray(json.sync.customApiConfigs)) {
              console.log('Importing configs from new array format', json.sync.customApiConfigs.length);
              importedConfigs = [...json.sync.customApiConfigs];
            } else {
              // 古い形式から読み込み - configCountに依存せず、存在するキーをすべて検索
              console.log('Importing configs from old individual keys format');
              
              // customApiConfig_XXXキーを検索
              const configKeys = Object.keys(json.sync).filter(key => key.startsWith('customApiConfig_'));
              
              if (configKeys.length === 0) {
                toast.error(t('No Custom API settings found in the file. Please check the file format.'));
                return;
              }
              
              // インデックス順にソートしてから処理
              configKeys.sort((a, b) => {
                const indexA = parseInt(a.split('_')[1], 10);
                const indexB = parseInt(b.split('_')[1], 10);
                return indexA - indexB;
              });
              
              for (const configKey of configKeys) {
                const config = json.sync[configKey];
                if (config) {
                  importedConfigs.push(config);
                } else {
                  console.warn(`Config for key ${configKey} not found`);
                }
              }
            }
          } catch (extractError: any) {
            console.error('Error extracting configs:', extractError);
            toast.error(t('Failed to extract Custom API settings: ') + extractError.message);
            return;
          }

          if (importedConfigs.length === 0) {
            toast.error(t('No Custom API settings found in the file. Please check the file format.'));
            return;
          }

          // IDが存在しない場合はインデックス+1をIDとして設定
          importedConfigs.forEach((config, index) => {
            if (!config.id) {
              config.id = index + 1
            }
          })

          // ID順にソート
          importedConfigs.sort((a, b) => (a.id || 0) - (b.id || 0))

          // デフォルトのマッピングを設定（同じインデックスに）
          const defaultMappings = importedConfigs.map((_, index) =>
            index < userConfig.customApiConfigs.length ? index : -1
          )

          setImportedConfigs(importedConfigs)
          setMappings(defaultMappings)
          setIsOpen(true)
          
        } catch (parseError: any) {
          console.error('Error parsing JSON:', parseError);
          toast.error(t('Invalid JSON format: ') + parseError.message);
          return;
        }
      } catch (textError: any) {
        console.error('Error reading file content:', textError);
        toast.error(t('Failed to read file content: ') + textError.message);
        return;
      }
    } catch (fileError: any) {
      console.error('Error opening file:', fileError);
      toast.error(t('Failed to open file: ') + fileError.message);
      return;
    }
  }

  // インポート実行
  const handleImport = async () => {
    try {
      // 確認ダイアログ
      const confirmMessage = t(
        'Selected Custom API settings will be imported. This will overwrite existing settings including individual API keys. Common API Key will be preserved. Continue?'
      )
      
      if (!window.confirm(confirmMessage)) {
        return
      }

      try {
        // 現在の設定のコピーを作成
        const newConfigs = [...userConfig.customApiConfigs]

        // 新しく追加する設定を格納する配列
        const configsToAdd: CustomApiConfig[] = []

        try {
          // マッピングに基づいて設定を適用
          importedConfigs.forEach((config, index) => {
            const targetIndex = mappings[index]
            
            if (targetIndex === -2) {
              // 新規として追加（デフォルトで有効化）
              const newIndex = newConfigs.length + configsToAdd.length
              configsToAdd.push({
                ...config,
                id: newIndex + 1, // 新しいIDを割り当て
                enabled: true // 新しく追加したボットを有効化
              })
            } else if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < newConfigs.length) {
              // 既存の設定を置き換え（有効化状態も更新）
              newConfigs[targetIndex] = {
                ...config,
                id: newConfigs[targetIndex].id, // IDは保持
                enabled: true // インポートした設定は有効化
              }
            }
          })
        } catch (mappingError: any) {
          console.error('Error applying mappings:', mappingError)
          toast.error(t('Failed to apply mappings: ') + mappingError.message)
          return
        }
        
        // 新しい設定を追加
        const updatedConfigs = [...newConfigs, ...configsToAdd]
        
        try {
          // 設定をブラウザストレージに保存（ユーティリティ関数を使用）
          await updateUserConfig({
            customApiConfigs: updatedConfigs
          })
          
          // Reactの状態を更新（ストレージ保存が成功した後）
          updateConfigValue({
            customApiConfigs: updatedConfigs
          })
          
          // 成功メッセージ
          toast.success(t('Custom API settings imported successfully'))
          
          setIsOpen(false)
        } catch (storageError: any) {
          console.error('Error saving to storage:', storageError)
          toast.error(t('Failed to save settings to storage: ') + storageError.message)
          
          // エラーが発生した場合、状態を元に戻す
          updateConfigValue({
            customApiConfigs: userConfig.customApiConfigs || []
          })
        }
      } catch (configError: any) {
        console.error('Error processing configurations:', configError)
        toast.error(t('Failed to process configurations: ') + configError.message)
      }
    } catch (error: any) {
      console.error('Error applying import:', error)
      toast.error(t('Failed to apply imported settings: ') + error.message)
    }
  }

  return (
    <>
      <Button
        size="normal"
        text={t('Import Template')}
        icon={<BiImport />}
        onClick={handleFileSelect}
        color="flat"
        className="w-full justify-center bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-600/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
      />
      
      <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={t('Import Custom API Template')}
      >
        <div className="mb-6 px-2">
          <p className="text-sm text-gray-500">
            {t('Select which models to import and where to place them. Individual API keys will be overwritten, but common API key will be preserved.')}
          </p>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto px-5">
          {importedConfigs.map((importConfig, index) => (
            <div key={index} className="flex items-center gap-6 mb-2 py-2">
              <div className="w-1/3">
                <p className="font-medium">{importConfig.name}</p>
                <p className="text-xs text-gray-400 mt-1">{importConfig.model}</p>
              </div>
              <div className="w-1/6 text-center text-lg">→</div>
              <div className="w-1/2">
                <Select
                  options={[
                    { name: t('Do not import'), value: '-1' },
                    { name: t('Add as new'), value: '-2' },
                    ...userConfig.customApiConfigs.map((config, i) => ({
                      name: `${i+1}: ${config.name}`,
                      value: String(i)
                    }))
                  ]}
                  value={String(mappings[index])}
                  onChange={(v) => {
                    const newValue = parseInt(v, 10)
                    const newMappings = [...mappings]
                    
                    // 選択された値が有効なモデル番号で、他の場所で既に選択されている場合
                    if (newValue >= 0) {
                      // 同じ値が他の場所で使われているかチェック
                      const duplicateIndex = newMappings.findIndex(
                        (mapping, i) => i !== index && mapping === newValue
                      )
                      
                      // 重複があれば、その場所を「Do not import」に設定
                      if (duplicateIndex !== -1) {
                        newMappings[duplicateIndex] = -1
                      }
                    }
                    
                    // 現在の選択を更新
                    newMappings[index] = newValue
                    setMappings(newMappings)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-4 mt-6 px-2">
          <Button text={t('Cancel')} onClick={() => setIsOpen(false)} color="flat" />
          <Button text={t('Import')} onClick={handleImport} color="primary" />
        </div>
      </Dialog>
    </>
  )
}

export default CustomAPITemplateImportPanel
