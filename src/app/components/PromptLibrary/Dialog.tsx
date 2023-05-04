import PromptLibrary from './Library'
import Dialog from '../Dialog'
import { Prompt } from '~services/prompts'

interface Props {
  isOpen: boolean
  onClose: () => void
  insertPrompt: (prompt: Prompt) => void
}

const PromptLibraryDialog = (props: Props) => {
  return (
    <Dialog title="Prompt Library" open={props.isOpen} onClose={props.onClose} className="w-[800px] min-h-[400px]">
      <div className="p-5 overflow-auto">
        <PromptLibrary insertPrompt={props.insertPrompt} />
      </div>
    </Dialog>
  )
}

export default PromptLibraryDialog
