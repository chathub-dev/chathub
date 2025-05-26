import { Menu, Transition } from '@headlessui/react';
import { FC, Fragment, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEnabledBots } from '~app/hooks/use-enabled-bots';
import { getUserConfig } from '~services/user-config';
import BotIcon from './BotIcon';

interface Props {
  triggerNode: ReactNode
  selectedIndex: number
  onChange: (index: number) => void
}

interface BotInfo {
  name: string;
  avatar: string;
}

const SwitchBotDropdown: FC<Props> = (props) => {
  const { t } = useTranslation();
  const enabledBots = useEnabledBots(); // This now returns { index, bot }

  // ボット情報（名前とアバター）を保持する状態を追加（インデックスベース）
  const [botInfos, setBotInfos] = useState<Record<number, BotInfo>>({});

  useEffect(() => {
    const initializeBotInfos = async () => {
      const config = await getUserConfig();
      const customApiConfigs = config.customApiConfigs || [];
  
      const infos = enabledBots.reduce<Record<number, BotInfo>>((acc, { index, bot }) => {
        // enabledBots now directly gives us the bot info from customApiConfigs
        acc[index] = {
          name: bot.name,
          avatar: bot.avatar || 'OpenAI.Black'
        };
        return acc;
      }, {});
  
      setBotInfos(infos);
    };
  
    initializeBotInfos();
  }, [enabledBots]);

  return (
    <Menu as="div" className="relative inline-block text-left h-5">
      <Menu.Button className="flex">{props.triggerNode}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-1 py-1 rounded-md bg-secondary shadow-lg focus:outline-none max-h-[300px] overflow-y-auto">
          {enabledBots.map(({ index, bot }) => { // Destructure index and bot
            if (index === props.selectedIndex) {
              return null
            }
            const botInfo = botInfos[index]; // Use index to get botInfo
            return (
              <Menu.Item key={`custom-${index}`}>
                <div
                  className="px-4 py-2 ui-active:bg-primary-blue ui-active:text-white ui-not-active:text-secondary-text cursor-pointer flex flex-row items-center gap-3 pr-8"
                  onClick={() => props.onChange(index)} // Pass index to onChange
                >
                  <div className="w-4 h-4">
                    <BotIcon iconName={botInfo?.avatar ?? bot.avatar ?? 'OpenAI.Black'} size={16} />
                  </div>
                  <p className="text-sm whitespace-nowrap">{botInfo?.name ?? bot.name ?? `Custom Bot ${index + 1}`}</p>
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
