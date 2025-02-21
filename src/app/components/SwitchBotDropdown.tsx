import { Menu, Transition } from '@headlessui/react';
import { FC, Fragment, ReactNode, useState, useEffect } from 'react';
import { BotId } from '~app/bots';
import { useEnabledBots } from '~app/hooks/use-enabled-bots';
import { getUserConfig } from '~services/user-config';

interface Props {
  triggerNode: ReactNode
  selectedBotId: BotId
  onChange: (botId: BotId) => void
}

interface BotInfo {
  name: string;
  avatar: string;
}

const SwitchBotDropdown: FC<Props> = (props) => {
  const enabledBots = useEnabledBots();

  // ボット情報（名前とアバター）を保持する状態を追加
  const [botInfos, setBotInfos] = useState<Record<BotId, BotInfo>>({} as Record<BotId, BotInfo>);

  useEffect(() => {
    const initializeBotInfos = async () => {
      const config = await getUserConfig();
      
      const customApiConfigs = config.customApiConfigs || [];
  
      const infos = enabledBots.reduce<Record<BotId, BotInfo>>((acc, { botId, bot }) => {
        if (botId.startsWith('customchat')) {
        const index = Number(botId.replace('customchat', '')) - 1;
        const config = customApiConfigs[index];
        if (config) {
            acc[botId] = {
              name: config.name,
              avatar: config.avatar || bot.avatar // カスタムアバターがない場合はデフォルトを使用
            };
          }
        } else {
          // 通常のボットの場合はデフォルト値を使用
          acc[botId] = {
            name: bot.name,
            avatar: bot.avatar
          };
        }
        return acc;
      }, {} as Record<BotId, BotInfo>);
  
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
          {enabledBots.map(({ botId, bot }) => {
            if (botId === props.selectedBotId) {
              return null
            }
            const botInfo = botInfos[botId];
            return (
              <Menu.Item key={botId}>
                <div
                  className="px-4 py-2 ui-active:bg-primary-blue ui-active:text-white ui-not-active:text-secondary-text cursor-pointer flex flex-row items-center gap-3 pr-8"
                  onClick={() => props.onChange(botId)}
                >
                  <div className="w-4 h-4">
                    <img src={botInfo?.avatar ?? bot.avatar} className="w-4 h-4" />
                  </div>
                  <p className="text-sm whitespace-nowrap">{botInfo?.name ?? bot.name}</p>
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
