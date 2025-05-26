import { useAtom } from 'jotai'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { releaseNotesAtom } from '~app/state'
import { markCurrentVersionAsRead } from '~services/release-notes'
import Button from '../Button'
import Dialog from '../Dialog'
import Markdown from '../Markdown'

const ReleaseNotesModal: FC = () => {
  const { t } = useTranslation()
  const [notes, setNotes] = useAtom(releaseNotesAtom)

  const handleClose = () => {
    setNotes([])
  }

  const handleNeverShow = () => {
    markCurrentVersionAsRead() // この時点でのみバージョン情報を更新
    setNotes([])
  }

  return (
    <Dialog title={t('Recent Updates')} open={notes.length > 0} onClose={handleClose} className="w-[600px]">
      {/* max-heightとoverflow-y-autoを追加してスクロール可能に */}
      <div className="flex flex-col gap-3 px-5 py-5 max-h-[60vh] overflow-y-auto">
        {notes.map((note, i) => {
          return (
            <div key={i} className="flex flex-row gap-2 items-center">
              <div className="flex-none rounded-full p-1 text-green-400 bg-green-400/10">
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              <div className="text-primary-text font-medium">
                <Markdown allowHtml={true}>{t(note)}</Markdown>
              </div>
            </div>
          )
        })}
      </div>
      {/* ボタン領域の追加 */}
      <div className="border-t border-solid border-primary-border px-5 py-3 flex justify-between">
        <button
          onClick={handleNeverShow}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('ReleaseNote-HideUntilNextVersion')}
        </button>
        <div className="flex flex-row items-center gap-2">
          <button
            className="text-sm bg-secondary rounded-full px-6 py-[5px] flex flex-col items-center text-primary-text"
            onClick={handleClose}
          >
            <span className="font-medium">{t('ReleaseNote-Close')}</span>
            <span className="text-xs text-gray-500">{t('ReleaseNote-ShowAgain')}</span>
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ReleaseNotesModal
