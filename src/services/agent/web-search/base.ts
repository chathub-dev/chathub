export interface SearchResultItem {
  title: string
  abstract: string
  link: string
}

export interface SearchResult {
  items: SearchResultItem[]
}

abstract class WebSearch {
  abstract search(query: string, signal?: AbortSignal): Promise<SearchResult>
}

export default WebSearch
