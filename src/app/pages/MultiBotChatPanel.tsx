import { Container, Input } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
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

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      const { input } = Object.fromEntries(formData.entries())
      form.reset()
      onUserSendMessage(input as string)
    },
    [onUserSendMessage],
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
          <form onSubmit={onSubmit}>
            <Input
              size="lg"
              name="input"
              autoComplete="off"
              className="shadow-[0_0_10px_rgba(0,0,0,0.10)]"
              disabled={chatgptChat.generating || bingChat.generating}
              placeholder="Ask both ..."
            />
          </form>
        </Container>
      </div>
    </main>
  )
}

export default MultiBotChatPanel
