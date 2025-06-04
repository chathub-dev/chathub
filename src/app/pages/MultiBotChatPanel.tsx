import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { sample, uniqBy } from 'lodash-es'
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cx } from '~/utils'
import { pendingSearchQueryAtom } from '../state'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import LayoutSwitch from '~app/components/Chat/LayoutSwitch'
import { Layout } from '~app/consts'
import { useChat } from '~app/hooks/use-chat'
import ConversationPanel from '../components/Chat/ConversationPanel'

// デフォルトのボットインデックス（0から5まで）
const DEFAULT_BOTS: number[] = [0, 1, 2, 3, 4, 5]

const layoutAtom = atomWithStorage<Layout>('multiPanelLayout', 2, undefined, { getOnInit: true })

const imageInputPanelAtom = atomWithStorage<number[]>('imageInputPanelBots', DEFAULT_BOTS.slice(0, 3))
const singlePanelBotAtom = atomWithStorage<number[]>('singlePanelBot', DEFAULT_BOTS.slice(0, 1))
const twoPanelBotsAtom = atomWithStorage<number[]>('multiPanelBots:2', DEFAULT_BOTS.slice(0, 2))
const threePanelBotsAtom = atomWithStorage<number[]>('multiPanelBots:3', DEFAULT_BOTS.slice(0, 3))
const fourPanelBotsAtom = atomWithStorage<number[]>('multiPanelBots:4', DEFAULT_BOTS.slice(0, 4))
const sixPanelBotsAtom = atomWithStorage<number[]>('multiPanelBots:6', DEFAULT_BOTS.slice(0, 6))

function replaceDeprecatedBots(bots: number[]): number[] {
  // インデックスが有効かどうかを確認（0以上の整数であること）
  return bots.map((index) => (index >= 0 ? index : sample(DEFAULT_BOTS)!))
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
  const [pendingSearchQuery, setPendingSearchQuery] = useAtom(pendingSearchQueryAtom)

  useEffect(() => {
  }, [chats.length, supportImageInput])

  const sendSingleMessage = useCallback(
    (input: string, index: number) => {
      const chat = chats.find((c) => c.index === index)
      chat?.sendMessage(input)
    },
    [chats],
  )

  const sendAllMessage = useCallback(
    (input: string, image?: File) => {
      uniqBy(chats, (c) => c.index).forEach((c) => c.sendMessage(input, image))
    },
    [chats, layout],
  )

  // 保存された検索クエリがあれば自動的に送信
  useEffect(() => {
    // chats配列内のすべてのchatオブジェクトが準備完了しているか確認
    // AsyncAbstractBotの場合、初期化が完了していることを確認
    const allChatsReady = chats.length > 0 && chats.every(chat => {
      if (!chat || !chat.bot) return false;
      // chatオブジェクトのisInitializedプロパティを確認
      return chat.isInitialized;
    });
    if (pendingSearchQuery && !generating && allChatsReady) {
      sendAllMessage(pendingSearchQuery)
      
      setPendingSearchQuery(null)
    }
  }, [pendingSearchQuery, generating, chats, sendAllMessage, setPendingSearchQuery])

  const modifyAllLastMessage = async(text: string) => {
    uniqBy(chats, (c) => c.index).forEach((c) => c.modifyLastMessage(text))
  }

  const onSwitchBot = useCallback(
    (newIndex: number, arrayIndex: number) => {
      if (!setBots) {
        return
      }
      
      // 現在のチャットを取得
      const currentChat = chats[arrayIndex]
      
      // 前のモデルの会話状態をリセット
      if (currentChat) {
        currentChat.resetConversation()
      }
      
      setBots((bots) => {
        const newBots = [...bots]
        newBots[arrayIndex] = newIndex
        return newBots
      })
      
      // refreshを更新して再レンダリングを促す
      setRefresh(prev => prev + 1)
    },
    [chats, setBots, setRefresh],
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
          chats.length === 1 
            ? 'grid-cols-1' // 1つのモデルだけを表示する場合
            : chats.length % 3 === 0 ? 'grid-cols-3' : 'grid-cols-2',
          // chats.length > 3 ? 'gap-1 mb-1' : 'gap-2 mb-2',
          'gap-1 mb-1',
        )}
      >
        {chats.map((chat, index) => (
          <ConversationPanel
            key={`${chat.index}-${index}-${refresh}`} // refresh を key に含めることで再レンダリング
            index={chat.index}
            bot={chat.bot}
            messages={chat.messages}
            onUserSendMessage={(input) => sendSingleMessage(input, chat.index)}
            generating={chat.generating}
            stopGenerating={chat.stopGenerating}
            mode="compact"
            resetConversation={chat.resetConversation}
            onSwitchBot={setBots ? (newIndex) => onSwitchBot(newIndex, index) : undefined}
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

const SingleBotChatPanel: FC = () => {
  const [bots, setBots] = useAtom(singlePanelBotAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat = useChat(multiPanelBotIndices[0])
  
  const chats = useMemo(() => [chat], [chat])
  
  return <GeneralChatPanel
    chats={chats}
    setBots={setBots}
    supportImageInput={true}
  />
}

const TwoBotChatPanel: FC = () => {
  const [bots, setBots] = useAtom(twoPanelBotsAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat1 = useChat(multiPanelBotIndices[0])
  const chat2 = useChat(multiPanelBotIndices[1])
  
  const chats = useMemo(() => [chat1, chat2], [chat1, chat2])
  
  return <GeneralChatPanel
    chats={chats}
    setBots={setBots}
    supportImageInput={true}
  />
}

const TwoHorizonBotChatPanel: FC = () => {
  const [bots, setBots] = useAtom(twoPanelBotsAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat1 = useChat(multiPanelBotIndices[0])
  const chat2 = useChat(multiPanelBotIndices[1])
  
  const chats = useMemo(() => [chat1, chat2], [chat1, chat2])
  
  return <GeneralChatPanel
    chats={chats}
    setBots={setBots}
    supportImageInput={true}
  />
}

const ThreeBotChatPanel: FC = () => {
  const [bots, setBots] = useAtom(threePanelBotsAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat1 = useChat(multiPanelBotIndices[0])
  const chat2 = useChat(multiPanelBotIndices[1])
  const chat3 = useChat(multiPanelBotIndices[2])
  
  const chats = useMemo(() => [chat1, chat2, chat3], [chat1, chat2, chat3])
  
  return <GeneralChatPanel
    chats={chats}
    setBots={setBots}
    supportImageInput={true}
  />
}

const FourBotChatPanel: FC = () => {
  const [bots, setBots] = useAtom(fourPanelBotsAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat1 = useChat(multiPanelBotIndices[0])
  const chat2 = useChat(multiPanelBotIndices[1])
  const chat3 = useChat(multiPanelBotIndices[2])
  const chat4 = useChat(multiPanelBotIndices[3])
  
  const chats = useMemo(() => [chat1, chat2, chat3, chat4], [chat1, chat2, chat3, chat4])
  
  return <GeneralChatPanel
    chats={chats}
    setBots={setBots}
    supportImageInput={true}
  />
}

const SixBotChatPanel: FC = () => {
  const [bots, setBots] = useAtom(sixPanelBotsAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat1 = useChat(multiPanelBotIndices[0])
  const chat2 = useChat(multiPanelBotIndices[1])
  const chat3 = useChat(multiPanelBotIndices[2])
  const chat4 = useChat(multiPanelBotIndices[3])
  const chat5 = useChat(multiPanelBotIndices[4])
  const chat6 = useChat(multiPanelBotIndices[5])
  
  const chats = useMemo(() => [chat1, chat2, chat3, chat4, chat5, chat6], [chat1, chat2, chat3, chat4, chat5, chat6])
  
  return <GeneralChatPanel
    chats={chats}
    setBots={setBots}
    supportImageInput={true}
  />
}

const ImageInputPanel: FC = () => {
  const [bots, setBots] = useAtom(imageInputPanelAtom)
  const multiPanelBotIndices = useMemo(() => replaceDeprecatedBots(bots), [bots])
  
  const chat1 = useChat(multiPanelBotIndices[0])
  const chat2 = useChat(multiPanelBotIndices[1])
  const chat3 = useChat(multiPanelBotIndices[2])
  
  const chats = useMemo(() => [chat1, chat2, chat3], [chat1, chat2, chat3])
  
  return <GeneralChatPanel
    chats={chats}
    supportImageInput={true}
  />
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
    return <TwoHorizonBotChatPanel />
  }
  if (layout === 'single') {
    return <SingleBotChatPanel />
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
