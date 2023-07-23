import { ofetch } from 'ofetch'

export async function decodePoeFormkey(headHtml: string): Promise<string> {
  const resp = await ofetch('https://chathub.gg/api/poe/decode-formkey', {
    method: 'POST',
    body: { headHtml },
  })
  return resp.formkey
}
