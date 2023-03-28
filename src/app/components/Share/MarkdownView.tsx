import { FC, useCallback, useMemo, useState } from 'react'
import { trackEvent } from '~app/plausible'
import { ChatMessageModel } from '~types'
import Button from '../Button'

interface Props {
  messages: ChatMessageModel[]
}

const MarkdownView: FC<Props> = ({ messages }) => {
  const [copied, setCopied] = useState(false)

  const content = useMemo(() => {
    return messages
      .filter((m) => !!m.text)
      .map((m) => `**${m.author}**: ` + m.text)
      .join('\n\n')
  }, [messages])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
    trackEvent('share_chat_copy_markdown')
  }, [content])

  return (
    <div className="px-5 pt-3 pb-4 overflow-hidden flex flex-col h-full">
      <div className="mb-3">
        <Button size="small" text={copied ? 'Copied!' : 'Copy'} onClick={copy} />
      </div>
      <pre className="text-sm whitespace-pre-wrap bg-gray-200 p-2 rounded-md overflow-auto h-full">{content}</pre>
    </div>
  )
}

export default MarkdownView
