import PromptLibrary, { MagiskLibrary } from './Library'
import Dialog from '../Dialog'

interface PromptProps {
  isOpen: boolean
  onClose: () => void
  insertPrompt: (text: string) => void
}
interface MagiskProps {
  isOpen: boolean
  onClose: () => void
  insertMagisk: (text: string) => void
}
export const PromptLibraryDialog = (props: PromptProps) => {
  return (
    <Dialog title="Prompt Library" open={props.isOpen} onClose={props.onClose} className="w-[800px] min-h-[400px]">
      <div className="p-5 overflow-auto">
        <PromptLibrary insertPrompt={props.insertPrompt} />
      </div>
    </Dialog>
  )
}

export const MagiskLibraryDialog = (props: MagiskProps) => {
  return (
    <Dialog title="Magisk Library" open={props.isOpen} onClose={props.onClose} className="w-[800px] min-h-[400px]">
      <div className="p-5 overflow-auto">
        <MagiskLibrary />
      </div>
    </Dialog>
  )
}

