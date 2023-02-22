import { Container, Input } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { ChatMessageModel } from '~types'
import { BotId } from '../../bots'
import MessageList from './ChatMessageList'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId) => void
  replying: boolean
}

const ConversationPanel: FC<Props> = (props) => {
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      const { input } = Object.fromEntries(formData.entries())
      form.reset()
      if (input) {
        props.onUserSendMessage(input as string, props.botId)
      }
    },
    [props],
  )
  return (
    <div className="py-5 flex flex-col overflow-hidden">
      <div className="text-center font-bold">{props.botId}</div>
      <MessageList botId={props.botId} messages={props.messages} />
      <Container maxW="md" className="my-0">
        <form onSubmit={onSubmit}>
          <Input name="input" autoComplete="off" disabled={props.replying} placeholder={`Ask ${props.botId} ...`} />
        </form>
      </Container>
    </div>
  )
}

export default ConversationPanel
