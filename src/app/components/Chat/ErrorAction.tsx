import { Button } from '@chakra-ui/react'
import { FC } from 'react'
import { ChatError, ErrorCode } from '~utils/errors'

interface Props {
  error: ChatError
}

const ErrorAction: FC<Props> = ({ error }) => {
  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    return (
      <a href="https://bing.com" target="_blank" rel="noreferrer">
        <Button size="sm">Login at bing.com</Button>
      </a>
    )
  }
  if (error.code === ErrorCode.CLOUDFLARE) {
    return <Button size="sm">Login at chat.openai.com</Button>
  }
  return null
}

export default ErrorAction
