import { ofetch } from 'ofetch'
import { ChatError, ErrorCode } from '~utils/errors'

interface CreationResponse {
  data: {
    sessionId: string
  }
  success: boolean
  errorMsg: string | null
  errorCode: string | null
}

export async function createConversation(firstQuery: string) {
  const resp = await ofetch<CreationResponse>('https://qianwen.aliyun.com/addSession', {
    method: 'POST',
    body: { firstQuery },
    headers: {
      'X-Xsrf-Token': '7a3dae93-1d29-4eb6-9940-34efad5a2b78',
    },
  })
  if (!resp.success) {
    if (resp.errorCode === '4000') {
      throw new ChatError('请先登录通义千问账号', ErrorCode.QIANWEN_WEB_UNAUTHORIZED)
    }
    throw new Error(`Error: ${resp.errorCode} ${resp.errorMsg}`)
  }
  return resp.data.sessionId
}
