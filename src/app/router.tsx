import { createHashHistory, createRootRoute, createRoute, createRouter, useParams, Navigate } from '@tanstack/react-router'
import Layout from './components/Layout'
import MultiBotChatPanel from './pages/MultiBotChatPanel'
import SettingPage from './pages/SettingPage'
import SingleBotChatPanel from './pages/SingleBotChatPanel'
// SearchQueryHandler のインポートは不要になります

const rootRoute = createRootRoute()

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: MultiBotChatPanel,
})

function CustomChatRoute() {
  const { index } = useParams({ from: customChatRoute.id })
  return <SingleBotChatPanel index={parseInt(index, 10)} />
}

const customChatRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'chat/custom/$index',
  component: CustomChatRoute,
})

const settingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'setting',
  component: SettingPage,
})

// searchRoute の定義を削除 コメントは不要なので削除
// const searchRoute = createRoute({ ... })

const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, customChatRoute, settingRoute])])

const hashHistory = createHashHistory()
const router = createRouter({ routeTree, history: hashHistory })

export { router }
