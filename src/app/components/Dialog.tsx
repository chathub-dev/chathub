import { Dialog as HeadlessDialog } from '@headlessui/react'
import cx from 'classnames'
import { FC, PropsWithChildren } from 'react'
import closeIcon from '~/assets/icons/close.svg'

interface Props {
  title: string
  open: boolean
  onClose: () => void
  className?: string
}

const Dialog: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <HeadlessDialog open={props.open} onClose={props.onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 dark:bg-white/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center max-h-screen m-5">
        <HeadlessDialog.Panel
          className={cx(
            'mx-auto rounded-[36px] bg-white bg-white dark:bg-gray-800 shadow-xl max-h-full overflow-hidden flex flex-col',
            props.className,
          )}
        >
          <HeadlessDialog.Title className="border-b border-solid border-[var(--border-1)] flex flex-row justify-center items-center py-4 px-5">
            <span className="ml-auto" />
            <span className="font-bold text-[var(--text-1)] text-base">{props.title}</span>
            <img src={closeIcon} className="w-4 h-4 ml-auto mr-[10px] cursor-pointer" onClick={props.onClose} />
          </HeadlessDialog.Title>
          {props.children}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  )
}

export default Dialog
