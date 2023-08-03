import { FC, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Browser from 'webextension-polyfill'
import { ConversationContext } from '~app/context'
import { ChatError, ErrorCode } from '~utils/errors'
import Button from '../Button'

const ChatGPTAuthErrorAction = () => {
  const { t } = useTranslation()
  const isSidePanel = useMemo(() => location.href.includes('sidepanel.html'), [])
  return (
    <div className="flex flex-row gap-2 items-center">
      <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login to ChatGPT')} size="small" />
      </a>
      <span className="text-sm text-primary-text">OR</span>
      <a
        href={Browser.runtime.getURL('app.html#/setting')}
        target={isSidePanel ? '_blank' : undefined}
        rel="noreferrer"
      >
        <Button color="primary" text={t('Set API key')} size="small" />
      </a>
    </div>
  )
}

const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  const conversation = useContext(ConversationContext)
  const { t } = useTranslation()

  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    return (
      <a href="https://bing.com" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login at bing.com')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.BING_FORBIDDEN) {
    return (
      <a href="https://bing.com/new" target="_blank" rel="noreferrer">
        <Button color="primary" text="Join new Bing waitlist" size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.POE_UNAUTHORIZED) {
    return (
      <a href="https://poe.com" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login at poe.com')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.XUNFEI_UNAUTHORIZED) {
    return (
      <a href="https://xinghuo.xfyun.cn" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login at xfyun.cn')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.GPT4_MODEL_WAITLIST) {
    return (
      <a href="https://openai.com/waitlist/gpt-4-api" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Join the waitlist')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.CHATGPT_AUTH) {
    return (
      <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login to ChatGPT')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.CLAUDE_WEB_UNAUTHORIZED) {
    return (
      <a href="https://claude.ai" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Login to Claude.ai')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED) {
    return <ChatGPTAuthErrorAction />
  }
  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return <Button color="primary" text="Restart" size="small" onClick={() => conversation?.reset()} />
  }
  if (error.code === ErrorCode.BARD_EMPTY_RESPONSE) {
    return (
      <a href="https://bard.google.com" target="_blank" rel="noreferrer">
        <Button color="primary" text="Visit bard.google.com" size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.BING_CAPTCHA) {
    return (
      <a href="https://www.bing.com/turing/captcha/challenge" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Verify')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.LMSYS_SESSION_EXPIRED) {
    return (
      <a href="https://chat.lmsys.org" target="_blank" rel="noreferrer">
        <Button color="primary" text={t('Refresh session')} size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.CHATGPT_INSUFFICIENT_QUOTA) {
    return (
      <p className="ml-2 text-secondary-text text-sm">
        {t('This usually mean you need to add a payment method to your OpenAI account, checkout: ')}
        <a href="https://platform.openai.com/account/billing/" target="_blank" rel="noreferrer" className="underline">
          OpenAI billing
        </a>
      </p>
    )
  }
  if (
    error.code === ErrorCode.NETWORK_ERROR ||
    (error.code === ErrorCode.UNKOWN_ERROR && error.message.includes('Failed to fetch'))
  ) {
    return <p className="ml-2 text-secondary-text text-sm">{t('Please check your network connection')}</p>
  }
  if (error.code === ErrorCode.POE_MESSAGE_LIMIT) {
    return <p className="ml-2 text-secondary-text text-sm">{t('This is a limitation set by poe.com')}</p>
  }

  return null
}

export default ErrorAction
