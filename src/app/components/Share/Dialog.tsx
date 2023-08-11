import { useState } from 'react'
import { cx } from '~/utils'
import { AiFillCloud, AiFillFileMarkdown } from 'react-icons/ai'
import { ChatMessageModel } from '~types'
import Button from '../Button'
import Dialog from '../Dialog'
import MarkdownView from './MarkdownView'
import ShareGPTView from './ShareGPTView'

interface Props {
  open: boolean
  onClose: () => void
  messages: ChatMessageModel[]
}

const ShareDialog = (props: Props) => {
  const [mode, setMode] = useState<'markdown' | 'sharegpt' | undefined>()
  return (
    <Dialog
      title="Share Chat"
      open={props.open}
      onClose={props.onClose}
      className={cx('rounded-xl', mode ? 'w-[800px] h-[400px]' : 'w-[600px] h-[250px]')}
    >
      {(() => {
        if (mode === 'markdown') {
          return <MarkdownView messages={props.messages} />
        }
        if (mode === 'sharegpt') {
          return <ShareGPTView messages={props.messages} />
        }
        return (
          <div className="flex flex-col gap-5 justify-center items-center p-5 h-full">
            <Button
              text="Markdown"
              color="primary"
              icon={<AiFillFileMarkdown className="mr-1" />}
              onClick={() => setMode('markdown')}
            />
            <Button
              text="ShareGPT"
              color="primary"
              icon={<AiFillCloud className="mr-1" />}
              onClick={() => setMode('sharegpt')}
            />
          </div>
        )
      })()}
    </Dialog>
  )
}

export default ShareDialog
