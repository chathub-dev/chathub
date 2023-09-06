import { ofetch } from 'ofetch'
import { customAlphabet } from 'nanoid'
import { ChatError, ErrorCode } from '~utils/errors'

interface UserInfo {
  id: number
}

export async function getUserInfo(): Promise<UserInfo> {
  const resp = await ofetch<{ data?: UserInfo; code: number; msg: string }>(
    'https://www.baichuan-ai.com/api/user/user-info',
  )
  if (resp.code === 401) {
    throw new ChatError('请先登录百川账号', ErrorCode.BAICHUAN_WEB_UNAUTHORIZED)
  }
  if (resp.code !== 200) {
    throw new Error(`Error: ${resp.code} ${resp.msg}`)
  }
  return resp.data!
}

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')

function randomString(length: number) {
  return nanoid(length)
}

export function generateSessionId() {
  return 'p' + randomString(10)
}

export function generateMessageId() {
  return 'U' + randomString(14)
}
