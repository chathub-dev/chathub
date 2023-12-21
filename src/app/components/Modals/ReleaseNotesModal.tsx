import { useAtom } from 'jotai'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { releaseNotesAtom } from '~app/state'
import Dialog from '../Dialog'

const ReleaseNotesModal: FC = () => {
  const { t } = useTranslation()
  const [notes, setNotes] = useAtom(releaseNotesAtom)
  return (
    <Dialog title={t('Recent Updates')} open={notes.length > 0} onClose={() => setNotes([])} className="w-[600px]">
      <div className="flex flex-col gap-3 px-5 py-5">
        {notes.map((note, i) => {
          return (
            <div key={i} className="flex flex-row gap-2 items-center">
              <div className="flex-none rounded-full p-1 text-green-400 bg-green-400/10">
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              <span className="text-primary-text font-medium">{t(note)}</span>
            </div>
          )
        })}
      </div>
    </Dialog>
  )
}

export default ReleaseNotesModal
