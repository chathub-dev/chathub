import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import '../services/sentry'
import './base.scss'
import './i18n'
import { router } from './router'
import { useUserConfig } from './hooks/use-user-config'

function App() {
  // 設定の読み込みとモデル更新チェックを実行
  useUserConfig()
  return <RouterProvider router={router} />
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)
