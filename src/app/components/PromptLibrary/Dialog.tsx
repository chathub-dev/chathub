import PromptLibrary from './Library'
import Dialog from '../Dialog'

interface Props {
  isOpen: boolean
  onClose: () => void
  insertPrompt: (text: string) => void
}

const PromptLibraryDialog = (props: Props) => {
  return (
    <Dialog title="Prompt Library" open={props.isOpen} onClose={props.onClose} className="w-[800px] min-h-[400px]">
      <div className="my-5 px-5">
        <PromptLibrary insertPrompt={props.insertPrompt} />
      </div>
    </Dialog>
  )
}

export default PromptLibraryDialog
