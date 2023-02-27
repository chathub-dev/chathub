import { Container } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import TextInput from '~app/components/TextInput'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

const MultiBotChatPanel: FC = () => {
  const chatgptChat = useChat('chatgpt', 'multiple')
  const bingChat = useChat('bing', 'multiple')

  const onUserSendMessage = useCallback(
    (input: string, botId?: BotId) => {
      if (botId === 'chatgpt') {
        chatgptChat.sendMessage(input)
      } else if (botId === 'bing') {
        bingChat.sendMessage(input)
      } else {
        chatgptChat.sendMessage(input)
        bingChat.sendMessage(input)
      }
    },
    [bingChat, chatgptChat],
  )

  return (
    <main className="grid grid-cols-[1fr_2px_1fr] grid-rows-[1fr_80px] overflow-hidden">
      <ConversationPanel
        botId="chatgpt"
        messages={chatgptChat.messages}
        onUserSendMessage={onUserSendMessage}
        generating={chatgptChat.generating}
        stopGenerating={chatgptChat.stopGenerating}
      />
      <div className="bg-gray-300"></div>
      <ConversationPanel
        botId="bing"
        messages={bingChat.messages}
        onUserSendMessage={onUserSendMessage}
        generating={bingChat.generating}
        stopGenerating={bingChat.stopGenerating}
      />
      <div className="col-span-3">
        <Container className="h-full">
          <TextInput
            size="lg"
            name="input"
            autoComplete="off"
            className="shadow-[0_0_10px_rgba(0,0,0,0.10)]"
            isDisabled={chatgptChat.generating || bingChat.generating}
            placeholder="Ask both ..."
            onSubmitText={onUserSendMessage}
          />
        </Container>
      </div>
    </main>
  )
}

export default MultiBotChatPanel
