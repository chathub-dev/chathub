import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment, useState, useEffect } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Select from '../Select'


import ccllmLogo from '~/assets/logos/CCLLM.png'
import alpacaLogo from '~/assets/logos/alpaca.png'
import anthropicLogo from '~/assets/logos/anthropic.png'
import baichuanLogo from '~/assets/logos/baichuan.png'
import bardLogo from '~/assets/logos/bard.svg'
import bingLogo from '~/assets/logos/bing.svg'
import chatglmLogo from '~/assets/logos/chatglm.svg'
import chatgptLogo from '~/assets/logos/chatgpt.svg'
import chathubLogo from '~/assets/logos/chathub.svg'
import dollyLogo from '~/assets/logos/dolly.png'
import falconLogo from '~/assets/logos/falcon.jpeg'
import geminiLogo from '~/assets/logos/gemini.svg'
import grokLogo from '~/assets/logos/grok.png'
import guanacoLogo from '~/assets/logos/guanaco.png'
import koalaLogo from '~/assets/logos/koala.jpg'
import llamaLogo from '~/assets/logos/llama.png'
import mistralLogo from '~/assets/logos/mistral.png'
import oasstLogo from '~/assets/logos/oasst.svg'
import piLogo from '~/assets/logos/pi.png'
import pplxLogo from '~/assets/logos/pplx.jpg'
import qianwenLogo from '~/assets/logos/qianwen.png'
import customLogo from '~/assets/logos/rakuten.svg'
import rwkvLogo from '~/assets/logos/rwkv.png'
import stablelmLogo from '~/assets/logos/stablelm.png'
import vicunaLogo from '~/assets/logos/vicuna.jpg'
import wizardlmLogo from '~/assets/logos/wizardlm.png'
import xunfeiLogo from '~/assets/logos/xunfei.png'
import yiLogo from '~/assets/logos/yi.svg'
import hyperbolicLogo from '~/assets/logos/hyperbolic.svg'
import deepseekLogo from '~/assets/logos/deepseek.svg'
import sambaNovaLogo from '~/assets/logos/SambaNova.svg'



// アバターの定義
export const avatarMap = {
  'HuddleLLM': ccllmLogo,
  'alpaca': alpacaLogo,
  'anthropic': anthropicLogo,
  'baichuan': baichuanLogo,
  'bard': bardLogo,
  'bing': bingLogo,
  'chatglm': chatglmLogo,
  'chatgpt': chatgptLogo,
  'chathub': chathubLogo,
  'deepseek': deepseekLogo,
  'dolly': dollyLogo,
  'falcon': falconLogo,
  'gemini': geminiLogo,
  'grok': grokLogo,
  'guanaco': guanacoLogo,
  'hyperbolic': hyperbolicLogo,
  'koala': koalaLogo,
  'llama': llamaLogo,
  'mistral': mistralLogo,
  'oasst': oasstLogo,
  'pi': piLogo,
  'perplexity': pplxLogo,
  'qianwen': qianwenLogo,
  'custom': customLogo,
  'rwkv': rwkvLogo,
  'SambaNova': sambaNovaLogo,
  'stablelm': stablelmLogo,
  'vicuna': vicunaLogo,
  'wizardlm': wizardlmLogo,
  'xunfei': xunfeiLogo,
  'yi': yiLogo,
} as const

// avatarMapのキーの型を定義
export type AvatarKey = keyof typeof avatarMap;

// オプションの生成
const avatarOptions = Object.entries(avatarMap).map(([key, logo]) => ({
  name: key,
  icon: logo,
}))


interface AvatarSelectProps {
  value: string
  onChange: (value: string) => void
}

const AvatarSelect: FC<AvatarSelectProps> = ({ value, onChange }) => {
  const options = Object.entries(avatarMap).map(([key, icon]) => ({
    value: icon,
    name: key,
    icon: icon,
  }))

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      showIcon
    />
  )
}

export default AvatarSelect


/*
const AvatarSelect: FC<AvatarSelectProps> = ({ value, onChange }) => {
  // デフォルト値の設定
  const defaultAvatar = avatarMap['chathub']
  const [currentValue, setCurrentValue] = useState(value || defaultAvatar)

  useEffect(() => {
    if (value && value !== currentValue) {
      setCurrentValue(value)
    }
  }, [value])

  // 現在選択されているアイコンを取得
  const currentLogo = currentValue || chathubLogo
  const currentName = avatarOptions.find(option => option.icon   === currentValue)?.name || 'Chathub'

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <Menu.Button className="relative w-full cursor-default rounded-md bg-white pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none text-sm py-1.5">
    <div className="flex items-center gap-2">
            <img src={currentLogo} alt="" className="w-5 h-5" />
            <span className="block truncate">{currentName}</span>
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 mt-1 max-h-120 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {avatarOptions.map((option) => (
            <Menu.Item key={option.icon}>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-primary-blue text-white' : 'text-[#303030]'
                  } cursor-pointer select-none relative py-2 pl-3 pr-9 flex items-center gap-2`}
                  onClick={() => {
                    setCurrentValue(option.icon)
                    onChange(option.icon)
                  }}
                >
                  <img src={option.icon} alt="" className="w-5 h-5" />
                  <span className={`block truncate ${currentValue === option.icon ? 'font-semibold' : 'font-normal'}`}>
                    {option.name}
                  </span>
    </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default AvatarSelect
*/
