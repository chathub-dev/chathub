import { FC, useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { modelUpdateNotesAtom, ignoredModelUpdateNotificationAtom } from '~app/state'
import Dialog from '../Dialog'
import Button from '../Button'
import { useUserConfig } from '~app/hooks/use-user-config'
import { UserConfig, customApiConfig, updateUserConfig, MODEL_UPDATE_MAPPINGS } from '~services/user-config'
import Browser from 'webextension-polyfill'

const ModelUpdateModal: FC = () => {
  const { t } = useTranslation()
  const [notes, setNotes] = useAtom(modelUpdateNotesAtom)
  const [ignoredModels, setIgnoredModels] = useAtom(ignoredModelUpdateNotificationAtom)
  const config = useUserConfig()
  
  // コンポーネントマウント時に、localStorageからignoredModelsを読み込む
  useEffect(() => {
    const loadIgnoredModels = async () => {
      try {
        // localStorageから直接読み込む
        const result = await Browser.storage.local.get('ignoredModels')
        if (result.ignoredModels) {
          let parsedModels: string[] = []
          if (typeof result.ignoredModels === 'string') {
            try {
              parsedModels = JSON.parse(result.ignoredModels)
            } catch (e) {
              console.error('Failed to parse ignoredModels:', e)
            }
          } else if (Array.isArray(result.ignoredModels)) {
            parsedModels = result.ignoredModels
          }
          
          // 無視すべきモデルがある場合、notesからフィルタリング
          if (parsedModels.length > 0) {
            setIgnoredModels(parsedModels)
            setNotes(prev => prev.filter(note => 
              !parsedModels.some(ignored => 
                note.oldModel.toLowerCase() === ignored.toLowerCase() ||
                Object.keys(MODEL_UPDATE_MAPPINGS).some(pattern => 
                  note.oldModel.toLowerCase().includes(pattern.toLowerCase()) && 
                  parsedModels.some(im => im.toLowerCase().includes(pattern.toLowerCase()))
                )
              )
            ))
          }
        }
      } catch (e) {
        console.error('Error loading ignoredModels:', e)
      }
    }
    
    loadIgnoredModels()
  }, [setIgnoredModels, setNotes])
  
  const handleIgnore = async (oldModel: string) => {
    // 新しい無視リストを作成
    const newIgnoredModels = [...ignoredModels, oldModel]
    setIgnoredModels(newIgnoredModels)
    
    // localStorageに保存（文字列として）
    try {
      await Browser.storage.local.set({ 
        ignoredModels: JSON.stringify(newIgnoredModels) 
      })
    } catch (e) {
      console.error('Failed to save ignoredModels:', e)
    }
    
    // 表示中のノートから削除
    setNotes(prev => prev.filter(note => note.oldModel !== oldModel))
  }
  
  return (
    <Dialog 
      title={t('Model Updates Available')} 
      open={notes.length > 0} 
      onClose={() => setNotes([])}
      className="w-[600px]"
    >
      <div className="flex flex-col gap-5 px-5 py-5">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 whitespace-pre-line">
                {t('MODEL_UPDATE_WARNING')}
              </p>
            </div>
          </div>
        </div>
        {notes.map((note, i) => (
          <div key={i} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg">
            {/* ヘッダー部分 */}
            <div className="flex flex-col gap-1">
              <div className="text-lg font-bold text-gray-800">
                {t('Update Model')}
              </div>
              <div className="text-sm text-gray-600">
                {t('Change model from')} <span className="font-medium">{note.oldModel}</span> {t('to')} <span className="font-medium">{note.newModels[0]}</span>
              </div>
            </div>
            
            {/* 推奨モデル一覧 */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium text-gray-700 mb-1">
                {t('Recommended Models')}:
              </div>
              {note.newModels.map((model, i) => (
                <div key={i} className="ml-4 text-sm text-gray-600 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                  {model}
                </div>
              ))}
            </div>
            
            {/* ボタン部分 */}
            <div className="flex flex-row gap-3 mt-1">
              <Button
                text={t('Update Model')}
                size="normal"
                color="primary"
                onClick={() => {
                  const oldPattern = Object.keys(MODEL_UPDATE_MAPPINGS).find(pattern => 
                    note.oldModel.toLowerCase().includes(pattern.toLowerCase())
                  )
                  if (oldPattern) {
                    const newModels = MODEL_UPDATE_MAPPINGS[oldPattern]
                    if (config) {
                      const updatedConfig: UserConfig = {
                        ...config,
                        customApiConfigs: config.customApiConfigs.map(c => 
                          // 部分一致でモデルを更新するように修正
                          c.model.toLowerCase() === note.oldModel.toLowerCase() || 
                          (oldPattern && c.model.toLowerCase().includes(oldPattern.toLowerCase())) 
                            ? {...c, model: newModels[0]} 
                            : c
                        )
                      }
                      updateUserConfig(updatedConfig)
                    }
                  }
                  setNotes([])
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              />
              <Button
                text={t('Ignore This Time')}
                size="normal"
                color="flat"
                onClick={() => setNotes([])}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              />
              <Button
                text={t('Never Show Again')}
                size="normal"
                color="flat"
                onClick={() => handleIgnore(note.oldModel)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  )
}

export default ModelUpdateModal
