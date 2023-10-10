export type ResponseContent =
  | {
      content_type: 'text'
      parts: string[]
    }
  | {
      content_type: 'code'
      text: string
    }
  | {
      content_type: 'tether_browsing_display'
      result: string
    }

export type ResponseCitation = {
  start_ix: number
  end_ix: number
  metadata: {
    title: string
    url: string
    text: string
  }
}

export interface ImageContent {
  asset_pointer: string
  size_bytes: number
  width: number
  height: number
}
