import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import Browser from 'webextension-polyfill'
import '../services/sentry'
import './base.scss'
import './i18n'
import { router } from './router'
import { pendingSearchQueryAtom } from './state'

function App() {
  const setPendingSearchQuery = useSetAtom(pendingSearchQueryAtom)

  useEffect(() => {
    const loadPendingSearch = async () => {
      try {
        const result = await Browser.storage.local.get('pendingOmniboxSearch')
        const query = result.pendingOmniboxSearch
        if (typeof query === 'string' && query.trim() !== '') {
          console.log('[main.tsx] Found pending omnibox search:', query)
          setPendingSearchQuery(query)
          // 読み込んだらストレージから削除
          await Browser.storage.local.remove('pendingOmniboxSearch')
        }
      } catch (error) {
        console.error('Error loading pending omnibox search:', error)
      }
    }

    loadPendingSearch()
  }, [setPendingSearchQuery]) // 初回マウント時のみ実行

  return <RouterProvider router={router} />
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)
