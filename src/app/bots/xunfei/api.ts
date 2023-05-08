import { ofetch } from 'ofetch'
import './geeguard'
import { ChatError, ErrorCode } from '~utils/errors'

export async function getGeeToken(): Promise<string> {
  const resp: string = await ofetch('https://riskct.geetest.com/g2/api/v1/pre_load?client_type=web')
  const config = JSON.parse(resp.slice(1, -1))
  console.debug('GeeGuard config:', config)
  const token = await (window as any).GeeGuard.load({
    appId: 'ihuqg3dmuzcr2kmghumvivsk7c3l4joe',
    js: config.data.js,
    staticPath: config.data.static_path,
    gToken: config.data.g_token,
    type: 'gt',
  })
  return token.gee_token
}

export async function createConversation() {
  const resp = await ofetch('https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list', {
    method: 'POST',
    body: {},
  })
  if (resp.code === 80000) {
    throw new ChatError('请先登录讯飞账号', ErrorCode.XUNFEI_UNAUTHORIZED)
  }
  if (resp.code !== 0) {
    throw new Error(`Failed to create conversation: ${resp.desc}`)
  }
  return {
    chatId: resp.data.id as number,
  }
}
