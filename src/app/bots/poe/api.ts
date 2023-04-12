import { ofetch } from 'ofetch'
import ChatViewQuery from './graphql/ChatViewQuery.graphql?raw'
import AddMessageBreakMutation from './graphql/AddMessageBreakMutation.graphql?raw'
import SendMessageMutation from './graphql/SendMessageMutation.graphql?raw'
import SubscriptionsMutation from './graphql/SubscriptionsMutation.graphql?raw'
import MessageAddedSubscription from './graphql/MessageAddedSubscription.graphql?raw'
import ViewerStateUpdatedSubscription from './graphql/ViewerStateUpdatedSubscription.graphql?raw'
import { ChatError, ErrorCode } from '~utils/errors'

export const GRAPHQL_QUERIES = {
  AddMessageBreakMutation,
  ChatViewQuery,
  SendMessageMutation,
  SubscriptionsMutation,
  MessageAddedSubscription,
  ViewerStateUpdatedSubscription,
}

export interface PoeSettings {
  formkey: string
  tchannelData: ChannelData
}

interface ChannelData {
  minSeq: string
  channel: string
  channelHash: string
  boxName: string
  baseHost: string
  targetUrl: string
  enableWebsocket: boolean
}

export async function getPoeSettings() {
  return ofetch<PoeSettings>('https://poe.com/api/settings')
}

export interface GqlHeaders {
  formkey: string
  tchannel: string
}

export async function gqlRequest(queryName: keyof typeof GRAPHQL_QUERIES, variables: any, poeSettings: PoeSettings) {
  const query = GRAPHQL_QUERIES[queryName]
  return ofetch('https://poe.com/api/gql_POST', {
    method: 'POST',
    body: {
      query,
      variables,
    },
    headers: {
      'poe-formkey': poeSettings.formkey,
      'poe-tchannel': poeSettings.tchannelData.channel,
    },
  })
}

export async function getChatId(bot: string, poeSettings: PoeSettings): Promise<number> {
  const resp = await gqlRequest('ChatViewQuery', { bot }, poeSettings)
  if (!resp.data) {
    throw new ChatError('You need to login to Poe first', ErrorCode.POE_UNAUTHORIZED)
  }
  return resp.data.chatOfBot.chatId
}
