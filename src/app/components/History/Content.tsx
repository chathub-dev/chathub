import { FC, memo, useMemo, useRef } from 'react'
import { ViewportList } from 'react-viewport-list'
import useSWR from 'swr'
import { BotId } from '~app/bots'
import { loadHistoryMessages } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import { formatTime } from '~utils/format'
import ChatMessage from './ChatMessage'

type ViewportListItem =
  | {
      type: 'conversation'
      createdAt: number
    }
  | {
      type: 'message'
      message: ChatMessageModel
      conversationId: string
    }

const Timestamp = memo((props: { timestamp: number }) => {
  return <span className="text-[#A8A8A8] bg-[#F2F2F2] text-xs px-2 py-1 w-fit">{formatTime(props.timestamp)}</span>
})

Timestamp.displayName = 'Timestamp'

const HistoryContent: FC<{ botId: BotId }> = ({ botId }) => {
  const historyQuery = useSWR(`history:${botId}`, () => loadHistoryMessages(botId), { suspense: true })
  const ref = useRef<HTMLDivElement | null>(null)

  const items: ViewportListItem[] = useMemo(() => {
    const results: ViewportListItem[] = []
    for (const c of Array.from(historyQuery.data).reverse()) {
      const messages = c.messages.filter((m) => m.text)
      if (!messages.length) {
        continue
      }
      results.push({ type: 'conversation', createdAt: c.createdAt })
      for (const m of messages) {
        results.push({ type: 'message', message: m, conversationId: c.id })
      }
    }
    return results
  }, [historyQuery.data])

  return (
    <div className="flex flex-col overflow-y-auto" ref={ref}>
      <ViewportList viewportRef={ref} items={items} initialAlignToTop={true} initialIndex={items.length}>
        {(item) => {
          if (item.type === 'conversation') {
            return (
              <div className="text-center my-5" key={item.createdAt}>
                <Timestamp timestamp={item.createdAt} />
              </div>
            )
          }
          return (
            <ChatMessage
              key={item.message.id}
              botId={botId}
              message={item.message}
              conversationId={item.conversationId}
            />
          )
        }}
      </ViewportList>
    </div>
  )
}

export default HistoryContent
