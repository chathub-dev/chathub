import { FC } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { modelUpdateNotesAtom, ignoredModelUpdateNotificationAtom } from '~app/state'
import Dialog from '../Dialog'
import Button from '../Button'
import { useUserConfig } from '~app/hooks/use-user-config'
import { UserConfig, customApiConfig, updateUserConfig, MODEL_UPDATE_MAPPINGS } from '~services/user-config'

const ModelUpdateModal: FC = () => {
  const { t } = useTranslation()
  const [notes, setNotes] = useAtom(modelUpdateNotesAtom)
  const [ignoredModels, setIgnoredModels] = useAtom(ignoredModelUpdateNotificationAtom)
  const config = useUserConfig()
  
  const handleIgnore = (oldModel: string) => {
    setIgnoredModels(prev => [...prev, oldModel])
    setNotes(prev => prev.filter(note => note.oldModel !== oldModel))
  }
  
  return (
    <Dialog 
      title={t('Model Updates Available')} 
      open={notes.length > 0} 
      onClose={() => setNotes([])}
      className="w-[600px]"
    >
      <div className="flex flex-col gap-3 px-5 py-5">
        {notes.map((note, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex-none rounded-full p-1 text-blue-400 bg-blue-400/10">
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-primary-text font-medium">
                  {`Update recommended for ${note.oldModel}:`}
                </div>
                {note.newModels.map((model, i) => (
                  <div key={i} className="ml-4 text-secondary-text">
                    • {model}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex flex-col gap-2 w-full">
                <Button
                  text={t('Force update to recommended model')}
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
                            c.model === note.oldModel ? {...c, model: newModels[0]} : c
                          )
                        }
                        updateUserConfig(updatedConfig)
                      }
                    }
                    setNotes([])
                  }}
                  className="w-full"
                />
                <Button
                  text={t('Ok, Understood. I will update the config in the Setting page.')}
                  size="normal"
                  color="flat"
                  onClick={() => setNotes([])}
                  className="w-full"
                />
                <Button
                  text={t('Don\'t show this notification again')}
                  size="small"
                  color="flat"
                  onClick={() => handleIgnore(note.oldModel)}
                  className="self-end"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  )
}

export default ModelUpdateModal
