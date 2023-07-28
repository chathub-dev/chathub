import { ofetch } from 'ofetch'
import WebSearch, { SearchResult } from './base'

export class BingNewsSearch extends WebSearch {
  async search(query: string, signal?: AbortSignal): Promise<SearchResult> {
    const html = await this.fetchSerp(query, signal)
    const items = this.extractItems(html)
    return { items }
  }

  private async fetchSerp(query: string, signal?: AbortSignal) {
    const html = await ofetch('https://www.bing.com/news/infinitescrollajax', {
      method: 'GET',
      query: { InfiniteScroll: '1', q: query },
      signal,
    })
    return html
  }

  private extractItems(html: string) {
    const dom = new DOMParser().parseFromString(html, 'text/html')
    const nodes = dom.querySelectorAll('.newsitem')
    return Array.from(nodes)
      .slice(0, 10)
      .map((node) => {
        const nodeA = node.querySelector('.title')!
        const link = nodeA.getAttribute('href')!
        const title = nodeA.textContent || ''
        const nodeAbstract = node.querySelector('.snippet')
        const abstract = nodeAbstract?.textContent || ''
        return { title, link, abstract }
      })
  }
}
