import { FC, useCallback, useEffect, useState } from 'react'
import { CHATGPT_API_MODELS } from '~app/consts'
import { ChatGPTMode, getUserConfig, updateUserConfig } from '~services/user-config'

async function loadIsUsingGPT4() {
  const config = await getUserConfig()
  if (config.chatgptMode === ChatGPTMode.API) {
    return config.chatgptApiModel.startsWith('gpt-4')
  }
  return config.chatgptWebappModelName === 'gpt-4'
}

const ChatGPTModelToggle: FC = () => {
  const [isUsingGPT4, setIsUsingGPT4] = useState(false)

  useEffect(() => {
    loadIsUsingGPT4().then((using) => setIsUsingGPT4(using))
  }, [])

  const onChange = useCallback(async (e: any) => {
    const checked: boolean = e.target.checked
    const { chatgptMode } = await getUserConfig()
    if (chatgptMode === ChatGPTMode.API) {
      await updateUserConfig({ chatgptApiModel: checked ? 'gpt-4' : CHATGPT_API_MODELS[0] })
    } else {
      await updateUserConfig({ chatgptWebappModelName: checked ? 'gpt-4' : 'default' })
    }
    setIsUsingGPT4(checked)
  }, [])

  return (
    <label className="relative inline-flex items-center cursor-pointer scale-[.8]">
      <input type="checkbox" checked={isUsingGPT4} className="sr-only peer" onChange={onChange} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#4987FC]"></div>
      <span className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">GPT-4</span>
    </label>
  )
}

export default ChatGPTModelToggle
