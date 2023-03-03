import { createHashHistory, ReactRouter, RootRoute, Route, useParams } from '@tanstack/react-router'
import { BotId } from './bots'
import Layout from './components/Layout'
import MultiBotChatPanel from './pages/MultiBotChatPanel'
import SettingPage from './pages/SettingPage'
import SingleBotChatPanel from './pages/SingleBotChatPanel'

const rootRoute = new RootRoute()

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: MultiBotChatPanel,
})

function ChatRoute() {
  const { botId } = useParams({ from: chatRoute.id })
  return <SingleBotChatPanel botId={botId as BotId} />
}

const chatRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'chat/$botId',
  component: ChatRoute,
})

const settingRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'setting',
  component: SettingPage,
})

const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, chatRoute, settingRoute])])

const hashHistory = createHashHistory()
const router = new ReactRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }
