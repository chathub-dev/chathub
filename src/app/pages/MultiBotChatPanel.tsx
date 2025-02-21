import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { sample, uniqBy } from 'lodash-es'
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cx } from '~/utils'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import LayoutSwitch from '~app/components/Chat/LayoutSwitch'
import { CHATBOTS, Layout } from '~app/consts'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

const DEFAULT_BOTS: BotId[] = Object.keys(CHATBOTS).slice(0, 6) as BotId[]

const layoutAtom = atomWithStorage<Layout>('multiPanelLayout', 2, undefined, { getOnInit: true })
const twoPanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:2', DEFAULT_BOTS.slice(0, 2))
const threePanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:3', DEFAULT_BOTS.slice(0, 3))
const fourPanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:4', DEFAULT_BOTS.slice(0, 4))
const sixPanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:6', DEFAULT_BOTS.slice(0, 6))

function replaceDeprecatedBots(bots: BotId[]): BotId[] {
  return bots.map((bot) => (CHATBOTS[bot] ? bot : sample(DEFAULT_BOTS)!))
}

const GeneralChatPanel: FC<{
  chats: ReturnType<typeof useChat>[]
  setBots?: ReturnType<typeof useSetAtom<typeof twoPanelBotsAtom>>
  supportImageInput?: boolean
}> = ({ chats, setBots, supportImageInput }) => {
  const { t } = useTranslation()
  const generating = useMemo(() => chats.some((c) => c.generating), [chats])
  const [layout, setLayout] = useAtom(layoutAtom)
  const [refresh, setRefresh] = useState(0) // 更新用の state を追加


  useEffect(() => {
  }, [chats.length, supportImageInput])

  const sendSingleMessage = useCallback(
    (input: string, botId: BotId) => {
      const chat = chats.find((c) => c.botId === botId)
      chat?.sendMessage(input)
    },
    [chats],
  )

  const sendAllMessage = useCallback(
    (input: string, image?: File) => {
      uniqBy(chats, (c) => c.botId).forEach((c) => c.sendMessage(input, image))
    },
    [chats,  layout],
  )

  const modifyAllLastMessage = async(text: string) => {
    uniqBy(chats, (c) => c.botId).forEach((c) => c.modifyLastMessage(text))
  }

  const onSwitchBot = useCallback(
    (botId: BotId, index: number) => {
      if (!setBots) {
        return
      }
      setBots((bots) => {
        const newBots = [...bots]
        newBots[index] = botId
        return newBots
      })
    },
    [chats.length, setBots],
  )

  const onLayoutChange = useCallback(
    (v: Layout) => {
      setLayout(v)
    },
    [setLayout],
  )

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div
        className={cx(
        layout === 'twoHorizon' 
          ? 'flex flex-col'
          : 'grid auto-rows-fr',
          'overflow-hidden grow',
          chats.length % 3 === 0 ? 'grid-cols-3' : 'grid-cols-2',
          // chats.length > 3 ? 'gap-1 mb-1' : 'gap-2 mb-2',
          'gap-1 mb-1',
        )}
      >
        {chats.map((chat, index) => (
          <ConversationPanel
            key={`${chat.botId}-${index}-${refresh}`} // refresh を key に含めることで再レンダリング
            botId={chat.botId}
            bot={chat.bot}
            messages={chat.messages}
            onUserSendMessage={(input) => sendSingleMessage(input, chat.botId)}
            generating={chat.generating}
            stopGenerating={chat.stopGenerating}
            mode="compact"
            resetConversation={chat.resetConversation}
            onSwitchBot={setBots ? (botId) => onSwitchBot(botId, index) : undefined}
            onPropaganda={modifyAllLastMessage}
          />
        ))}
      </div>
      <div className="flex flex-row gap-3">
        <LayoutSwitch layout={layout} onChange={onLayoutChange} />
        <ChatMessageInput
          mode="full"
          className="rounded-2xl bg-primary-background px-4 py-2 grow"
          disabled={generating}
          onSubmit={sendAllMessage}
          actionButton={!generating && <Button text={t('Send')} color="primary" type="submit" />}
          autoFocus={true}
          supportImageInput={supportImageInput}
        />
      </div>
    </div>
  )
}

const TwoBotChatPanel = () => {
  const [bots, setBots] = useAtom(twoPanelBotsAtom)
  const multiPanelBotIds = useMemo(() => replaceDeprecatedBots(bots), [bots])
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chats = useMemo(() => [chat1, chat2], [chat1, chat2])
  return <GeneralChatPanel chats={chats} setBots={setBots} supportImageInput={true}/>
}

const TwoHorizonBotChatPanel = () => {
  const [bots, setBots] = useAtom(twoPanelBotsAtom)
  const multiPanelBotIds = useMemo(() => replaceDeprecatedBots(bots), [bots])
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chats = useMemo(() => [chat1, chat2], [chat1, chat2])
  return <GeneralChatPanel chats={chats} setBots={setBots} supportImageInput={true}/>
}

const ThreeBotChatPanel = () => {
  const [bots, setBots] = useAtom(threePanelBotsAtom)
  const multiPanelBotIds = useMemo(() => replaceDeprecatedBots(bots), [bots])
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chats = useMemo(() => [chat1, chat2, chat3], [chat1, chat2, chat3])
  return <GeneralChatPanel chats={chats} setBots={setBots} supportImageInput={true}/>
}

const FourBotChatPanel = () => {
  const [bots, setBots] = useAtom(fourPanelBotsAtom)
  const multiPanelBotIds = useMemo(() => replaceDeprecatedBots(bots), [bots])
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chat4 = useChat(multiPanelBotIds[3])
  const chats = useMemo(() => [chat1, chat2, chat3, chat4], [chat1, chat2, chat3, chat4])
  return <GeneralChatPanel chats={chats} setBots={setBots} supportImageInput={true}/>
}

const SixBotChatPanel = () => {
  const [bots, setBots] = useAtom(sixPanelBotsAtom)
  const multiPanelBotIds = useMemo(() => replaceDeprecatedBots(bots), [bots])
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chat4 = useChat(multiPanelBotIds[3])
  const chat5 = useChat(multiPanelBotIds[4])
  const chat6 = useChat(multiPanelBotIds[5])
  const chats = useMemo(() => [chat1, chat2, chat3, chat4, chat5, chat6], [chat1, chat2, chat3, chat4, chat5, chat6])
  return <GeneralChatPanel chats={chats} setBots={setBots} supportImageInput={true}/>
}

const ImageInputPanel = () => {
  const chat1 = useChat('chatgpt')
  const chat2 = useChat('bing')
  const chat3 = useChat('bard')
  const chats = useMemo(() => [chat1, chat2, chat3], [chat1, chat2, chat3])
  return <GeneralChatPanel chats={chats} supportImageInput={true} />
}

const MultiBotChatPanel: FC = () => {
  const layout = useAtomValue(layoutAtom)
  if (layout === 'sixGrid') {
    return <SixBotChatPanel />
  }
  if (layout === 4) {
    return <FourBotChatPanel />
  }
  if (layout === 3) {
    return <ThreeBotChatPanel />
  }
  if (layout === 'imageInput') {
    return <ImageInputPanel />
  }
  if (layout === 'twoHorizon') {
    return <TwoHorizonBotChatPanel />; // 新しいコンポーネントを作成
  }
  return <TwoBotChatPanel />
}

const MultiBotChatPanelPage: FC = () => {
  return (
    <Suspense>
      <MultiBotChatPanel />
    </Suspense>
  )
}

export default MultiBotChatPanelPage
