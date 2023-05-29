import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { BotId } from '~app/bots'
import { CHATBOTS } from '~app/consts'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command'
import { Columns } from 'lucide-react'
import allInOneIcon from '~/assets/all-in-one.svg'

function CommandBar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const onSelectBot = useCallback(
    (v?: string) => {
      if (v) {
        const botId = v as BotId
        navigate({ to: '/chat/$botId', params: { botId } })
      } else {
        navigate({ to: '/' })
      }
      setOpen(false)
    },
    [navigate],
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem onSelect={() => onSelectBot()}>
            <img src={allInOneIcon} className="w-5 h-5 mr-2" />
            <span>All-In-One</span>
          </CommandItem>
          {Object.keys(CHATBOTS).map((key) => {
            const botId = key as BotId
            const bot = CHATBOTS[botId]
            return (
              <CommandItem key={botId} onSelect={onSelectBot} value={botId}>
                <img src={bot.avatar} className="w-5 h-5 mr-2" />
                <span>{bot.name}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default CommandBar
