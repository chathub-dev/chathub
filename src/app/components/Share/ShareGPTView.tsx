import { FC, useCallback, useState } from 'react'
import { ChatMessageModel } from '~types'
import Button from '../Button'
import { Input } from '../Input'
import { uploadToShareGPT } from './sharegpt'

interface Props {
  messages: ChatMessageModel[]
}

const ShareGPTView: FC<Props> = ({ messages }) => {
  const [uploading, setUploading] = useState(false)
  const [resultId, setResultId] = useState<string | undefined>(undefined)
  const [copied, setCopied] = useState(false)

  const upload = useCallback(async () => {
    setUploading(true)
    try {
      const id = await uploadToShareGPT(messages)
      setResultId(id)
    } finally {
      setUploading(false)
    }
  }, [messages])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(`https://shareg.pt/${resultId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
  }, [resultId])

  return (
    <div className="p-5 flex flex-col items-center justify-center gap-5 h-full">
      <p className="w-[400px] text-center text-primary-text">
        This will upload this conversation to <b>sharegpt.com</b> and generate a link to share <b>publicly</b>.
      </p>
      {resultId ? (
        <div className="flex flex-row items-center gap-3 w-[300px]">
          <Input value={`https://shareg.pt/${resultId}`} readOnly className="grow" />
          <Button size="small" color="primary" text={copied ? 'Copied' : 'Copy'} onClick={copy} />
        </div>
      ) : (
        <Button text="Share" color="primary" onClick={upload} isLoading={uploading} />
      )}
    </div>
  )
}

export default ShareGPTView
