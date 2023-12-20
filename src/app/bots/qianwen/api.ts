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

export async function createConversation(firstQuery: string, csrfToken: string) {
  const resp = await ofetch<CreationResponse>('https://qianwen.aliyun.com/addSession', {
    method: 'POST',
    body: {
      firstQuery,
      sessionType: 'text_chat',
    },
    headers: {
      'X-Platform': 'pc_tongyi',
      'X-Xsrf-Token': csrfToken,
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

function extractVariable(variableName: string, html: string) {
  const regex = new RegExp(`${variableName}\\s?=\\s?"([^"]+)"`)
  const match = regex.exec(html)
  if (!match) {
    throw new Error('Failed to get csrfToken')
  }
  return match[1]
}

export async function getCsrfToken() {
  const html = await ofetch('https://tongyi.aliyun.com/qianwen/', { parseResponse: (t) => t })
  return extractVariable('csrfToken', html)
}
