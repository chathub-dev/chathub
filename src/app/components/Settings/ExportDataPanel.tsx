import { useTranslation } from 'react-i18next'
import { BiExport, BiImport } from 'react-icons/bi'
import { exportData, importData } from '~app/utils/export'
import Button from '../Button'

function ExportDataPanel() {
  const { t } = useTranslation()
  return (
    <div>
      <p className="font-bold mb-1 text-lg">{t('Export/Import All Data')}</p>
      <p className="mb-3 opacity-80">{t('Data includes all your settings, chat histories, and local prompts')}</p>
      <div className="flex flex-row gap-3">
        <Button size="small" text={t('Export')} icon={<BiExport />} onClick={exportData} />
        <Button size="small" text={t('Import')} icon={<BiImport />} onClick={importData} />
      </div>
    </div>
  )
}

export default ExportDataPanel
