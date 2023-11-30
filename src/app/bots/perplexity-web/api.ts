import { ofetch } from 'ofetch'

async function getSessionId() {
  const resp: string = await ofetch('https://labs-api.perplexity.ai/socket.io/?transport=polling&EIO=4')
  const data = JSON.parse(resp.slice(1))
  const sessionId: string = data.sid
  return sessionId
}

async function initSession(sessionId: string) {
  const resp = await ofetch(`https://labs-api.perplexity.ai/socket.io/?EIO=4&transport=polling&sid=${sessionId}`, {
    method: 'POST',
    body: '40{"jwt":"anonymous-ask-user"}',
  })
  if (resp !== 'OK') {
    throw new Error('Failed to init perplexity session')
  }
}

export async function createSession(): Promise<string> {
  const sessionId = await getSessionId()
  await initSession(sessionId)
  return sessionId
}
