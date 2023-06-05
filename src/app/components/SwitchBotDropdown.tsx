import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment, useCallback } from 'react'
import dropdownIcon from '~/assets/icons/dropdown.svg'
import { BotId } from '~app/bots'
import { useEnabledBots } from '~app/hooks/use-enabled-bots'

interface Props {
  excludeBotId: BotId
  onChange: (botId: BotId) => void
}

const SwitchBotDropdown: FC<Props> = (props) => {
  const enabledBots = useEnabledBots()

  const onSelect = useCallback(
    (botId: BotId) => {
      props.onChange(botId)
    },
    [props],
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
        <Menu.Items className="absolute left-0 z-10 mt-2 rounded-md bg-secondary shadow-lg focus:outline-none">
          {enabledBots.map(({ botId, bot }) => {
            if (botId === props.excludeBotId) {
              return null
            }
            return (
              <Menu.Item key={botId}>
                <div
                  className="px-4 py-2 ui-active:bg-primary-blue ui-active:text-white ui-not-active:text-secondary-text cursor-pointer flex flex-row items-center gap-3 pr-8"
                  onClick={() => onSelect(botId)}
                >
                  <div className="w-4 h-4">
                    <img src={bot.avatar} className="w-4 h-4" />
                  </div>
                  <p className="text-sm whitespace-nowrap">{bot.name}</p>
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
