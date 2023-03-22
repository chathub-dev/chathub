import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment, useCallback } from 'react'
import { BotId } from '~app/bots'
import { CHATBOTS } from '~app/consts'
import dropdownIcon from '~/assets/icons/dropdown.svg'
import { useSetAtom } from 'jotai'
import { compareBotsAtom } from '~app/state'

interface Props {
  excludeBotId: BotId
  index: number
}

const SwitchBotDropdown: FC<Props> = (props) => {
  const setCompareBots = useSetAtom(compareBotsAtom)

  const onSelect = useCallback(
    (botId: BotId) => {
      setCompareBots((bots) => {
        const newBots = [...bots] as [BotId, BotId]
        newBots[props.index] = botId
        return newBots
      })
    },
    [props.index, setCompareBots],
  )

  return (
    <Menu as="div" className="relative inline-block text-left h-5">
      <Menu.Button>
        <img src={dropdownIcon} className="w-5 h-5" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {Object.keys(CHATBOTS).map((key) => {
            const botId = key as BotId
            if (botId === props.excludeBotId) {
              return null
            }
            const bot = CHATBOTS[botId]
            return (
              <Menu.Item key={key}>
                <div
                  className="px-4 py-2 ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700 cursor-pointer flex flex-row items-center gap-3 pr-8"
                  onClick={() => onSelect(botId)}
                >
                  <div className="w-4 h-4">
                    <img src={bot.avatar} className="w-4 h-4" />
                  </div>
                  <p className="text-sm">{bot.name}</p>
                </div>
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default SwitchBotDropdown
