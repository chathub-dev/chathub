import { Dialog } from '@headlessui/react'
import PromptLibrary from './Library'

interface Props {
  isOpen: boolean
  onClose: () => void
  insertPrompt: (text: string) => void
}

const PromptLibraryDialog = (props: Props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="mx-auto w-[800px] rounded-[30px] bg-white shadow-xl p-10 pt-5 min-h-[400px]">
            <div className="text-center border-b border-solid border-[rgb(237,237,237)] flex flex-col justify-center pb-3 mb-5">
              <span className="font-semibold text-[#303030] text-lg">Prompt Library</span>
            </div>
            <PromptLibrary insertPrompt={props.insertPrompt} />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

export default PromptLibraryDialog
