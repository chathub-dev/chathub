export type RequestInitSubset = {
  method?: string
  body?: string
  headers?: Record<string, string>
  signal?: AbortSignal
}

export interface ProxyFetchRequestMessage {
  url: string
  options?: RequestInitSubset
}

export interface ProxyFetchResponseMetadata {
  status?: number
  statusText?: string
  headers?: Record<string, string>
}

export interface ProxyFetchResponseMetadataMessage {
  type: 'PROXY_RESPONSE_METADATA'
  metadata: ProxyFetchResponseMetadata
}

export type ProxyFetchResponseBodyChunkMessage = {
  type: 'PROXY_RESPONSE_BODY_CHUNK'
} & ({ done: true } | { done: false; value: string })
