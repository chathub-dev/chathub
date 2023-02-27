import { Button, Container } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { ChatMessageModel } from '~types'
import { BotId } from '../../bots'
import TextInput from '../TextInput'
import MessageList from './ChatMessageList'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId) => void
  generating: boolean
  stopGenerating: () => void
}

const ConversationPanel: FC<Props> = (props) => {
  const onSubmit = useCallback(
    async (input: string) => {
      props.onUserSendMessage(input as string, props.botId)
    },
    [props],
  )
  return (
    <div className="py-5 flex flex-col overflow-hidden">
      <div className="text-center font-bold">{props.botId}</div>
      <MessageList botId={props.botId} messages={props.messages} />
      <Container maxW="md" className="my-0">
        <div className="flex flex-row gap-2">
          <TextInput
            name="input"
            autoComplete="off"
            isDisabled={props.generating}
            placeholder={`Ask ${props.botId} ...`}
            onSubmitText={onSubmit}
          />
          {props.generating && <Button onClick={props.stopGenerating}>Stop</Button>}
        </div>
      </Container>
    </div>
  )
}

export default ConversationPanel
