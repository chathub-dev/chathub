import cx from 'classnames'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { uniqBy } from 'lodash-es'
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import LayoutSwitch from '~app/components/Chat/LayoutSwitch'
import PremiumFeatureModal from '~app/components/PremiumFeatureModal'
import { useChat } from '~app/hooks/use-chat'
import { usePremium } from '~app/hooks/use-premium'
import { trackEvent } from '~app/plausible'
import { getAllInOneLayout, setAllInOneLayout } from '~services/storage/all-in-one-layout'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

type OnLayoutChange = (layout: number) => void

const twoPanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:2', ['chatgpt', 'bing'])
const threePanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:3', ['chatgpt', 'bing', 'bard'])
const fourPanelBotsAtom = atomWithStorage<BotId[]>('multiPanelBots:4', ['chatgpt', 'bing', 'claude', 'bard'])

const GeneralChatPanel: FC<{
  chats: ReturnType<typeof useChat>[]
  botsAtom: typeof twoPanelBotsAtom
  onLayoutChange: OnLayoutChange
}> = ({ chats, botsAtom, onLayoutChange }) => {
  const { t } = useTranslation()
  const generating = useMemo(() => chats.some((c) => c.generating), [chats])
  const setBots = useSetAtom(botsAtom)
  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const premiumState = usePremium()
  const disabled = useMemo(() => !premiumState.isLoading && !premiumState.activated, [premiumState])

  useEffect(() => {
    if (disabled && chats.length > 2) {
      setPremiumModalOpen(true)
    }
  }, [chats.length, disabled])

  const onUserSendMessage = useCallback(
    (input: string, botId?: BotId) => {
      if (disabled && chats.length > 2) {
        setPremiumModalOpen(true)
        return
      }
      if (botId) {
        const chat = chats.find((c) => c.botId === botId)
        chat?.sendMessage(input)
      } else {
        uniqBy(chats, (c) => c.botId).forEach((c) => c.sendMessage(input))
      }
      trackEvent('send_messages', { count: chats.length })
    },
    [chats, disabled],
  )

  const onSwitchBot = useCallback(
    (botId: BotId, index: number) => {
      trackEvent('switch_bot', { botId, panel: chats.length })
      setBots((bots) => {
        const newBots = [...bots]
        newBots[index] = botId
        return newBots
      })
    },
    [chats.length, setBots],
  )

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div
        className={cx(
          'grid overflow-hidden grow auto-rows-fr gap-3 mb-3',
          chats.length === 3 ? 'grid-cols-3' : 'grid-cols-2',
        )}
      >
        {chats.map((chat, index) => (
          <ConversationPanel
            key={`${chat.botId}-${index}`}
            botId={chat.botId}
            bot={chat.bot}
            messages={chat.messages}
            onUserSendMessage={onUserSendMessage}
            generating={chat.generating}
            stopGenerating={chat.stopGenerating}
            mode="compact"
            resetConversation={chat.resetConversation}
            onSwitchBot={(botId) => onSwitchBot(botId, index)}
          />
        ))}
      </div>
      <div className="flex flex-row gap-3">
        <LayoutSwitch layout={chats.length} onChange={onLayoutChange} />
        <ChatMessageInput
          mode="full"
          className="rounded-[15px] bg-primary-background px-4 py-2 grow"
          disabled={generating}
          onSubmit={onUserSendMessage}
          actionButton={!generating && <Button text={t('Send')} color="primary" type="submit" />}
          autoFocus={true}
        />
      </div>
      <PremiumFeatureModal open={premiumModalOpen} setOpen={setPremiumModalOpen} />
    </div>
  )
}

const TwoBotChatPanel: FC<{ onLayoutChange: OnLayoutChange }> = (props) => {
  const multiPanelBotIds = useAtomValue(twoPanelBotsAtom)
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chats = useMemo(() => [chat1, chat2], [chat1, chat2])
  return <GeneralChatPanel chats={chats} botsAtom={twoPanelBotsAtom} onLayoutChange={props.onLayoutChange} />
}

const ThreeBotChatPanel: FC<{ onLayoutChange: OnLayoutChange }> = (props) => {
  const multiPanelBotIds = useAtomValue(threePanelBotsAtom)
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chats = useMemo(() => [chat1, chat2, chat3], [chat1, chat2, chat3])
  return <GeneralChatPanel chats={chats} botsAtom={threePanelBotsAtom} onLayoutChange={props.onLayoutChange} />
}

const FourBotChatPanel: FC<{ onLayoutChange: OnLayoutChange }> = (props) => {
  const multiPanelBotIds = useAtomValue(fourPanelBotsAtom)
  const chat1 = useChat(multiPanelBotIds[0])
  const chat2 = useChat(multiPanelBotIds[1])
  const chat3 = useChat(multiPanelBotIds[2])
  const chat4 = useChat(multiPanelBotIds[3])
  const chats = useMemo(() => [chat1, chat2, chat3, chat4], [chat1, chat2, chat3, chat4])
  return <GeneralChatPanel chats={chats} botsAtom={fourPanelBotsAtom} onLayoutChange={props.onLayoutChange} />
}

const MultiBotChatPanel: FC = () => {
  const [layout, setLayout] = useState(() => getAllInOneLayout())

  const onLayoutChange = useCallback((layout: number) => {
    setLayout(layout)
    setAllInOneLayout(layout)
  }, [])

  if (layout === 4) {
    return <FourBotChatPanel onLayoutChange={onLayoutChange} />
  }
  if (layout === 3) {
    return <ThreeBotChatPanel onLayoutChange={onLayoutChange} />
  }
  return <TwoBotChatPanel onLayoutChange={onLayoutChange} />
}

const MultiBotChatPanelPage: FC = () => {
  return (
    <Suspense>
      <MultiBotChatPanel />
    </Suspense>
  )
}

export default MultiBotChatPanelPage
