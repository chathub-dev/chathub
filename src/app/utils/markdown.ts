import TurndownService from 'turndown'

const turndownService = new TurndownService()

export function html2md(html: string) {
  return turndownService.turndown(html)
}
