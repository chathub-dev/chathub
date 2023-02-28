import { Alert, Button } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { chatGPTClient } from '~app/bots/chatgpt-webapp/client'
import { ChatError, ErrorCode } from '~utils/errors'

const ChatGPTAuthErrorAction = () => {
  const [fixing, setFixing] = useState(false)
  const [fixed, setFixed] = useState(false)

  const fixChatGPT = useCallback(async () => {
    setFixing(true)
    try {
      await chatGPTClient.fixAuthState()
    } catch (e) {
      console.error(e)
      return
    } finally {
      setFixing(false)
    }
    setFixed(true)
  }, [])

  if (fixed) {
    return (
      <Alert status="info" variant="left-accent" className="text-sm">
        Fixed, please retry chat
      </Alert>
    )
  }

  return (
    <Button size="sm" onClick={fixChatGPT} isLoading={fixing}>
      Login or verify
    </Button>
  )
}

const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    return (
      <a href="https://bing.com" target="_blank" rel="noreferrer">
        <Button size="sm">Login at bing.com</Button>
      </a>
    )
  }
  if (error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED) {
    return <ChatGPTAuthErrorAction />
  }
  return null
}

export default ErrorAction
