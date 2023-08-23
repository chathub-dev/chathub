import WebSocketAsPromised from 'websocket-as-promised'
import { GradioBot } from '../gradio'

export class LMSYSBot extends GradioBot {
  constructor(model: string) {
    super('wss://chat.lmsys.org/queue/join', model, [0.7, 1, 512], 'text')
  }

  private async initializeSession(
    fnIndex: number,
    sessionHash: string,
    data: unknown[],
    signal?: AbortSignal,
  ): Promise<void> {
    const wsp = new WebSocketAsPromised(this.wsUrl, {
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (data) => JSON.parse(data as string),
    })
    signal?.addEventListener('abort', () => wsp.close())
    return new Promise((resolve, reject) => {
      wsp.onUnpackedMessage.addListener((event) => {
        if (event.msg === 'send_hash') {
          wsp.sendPacked({ fn_index: fnIndex, session_hash: sessionHash })
        } else if (event.msg === 'send_data') {
          wsp.sendPacked({ fn_index: fnIndex, data, event_data: null, session_hash: sessionHash })
        } else if (event.msg === 'process_completed') {
          resolve()
        }
      })
      wsp.open().catch((err) => reject(err))
    })
  }

  async createSession(signal?: AbortSignal) {
    const sessionHash = await super.createSession(signal)
    await Promise.all([
      this.initializeSession(36, sessionHash, [], signal),
      this.initializeSession(43, sessionHash, [{}], signal),
    ])
    return sessionHash
  }
}
