import { ChakraProvider } from '@chakra-ui/react'
import { Outlet, ReactRouter, RootRoute, Route, useParams } from '@tanstack/react-router'
import { BotId } from './bots'
import Sidebar from './components/Sidebar'
import MultiBotChatPanel from './pages/MultiBotChatPanel'
import SingleBotChatPanel from './pages/SingleBotChatPanel'

function Layout() {
  return (
    <ChakraProvider>
      <div className="grid grid-cols-[200px_1fr] h-screen">
        <Sidebar />
        <Outlet />
      </div>
    </ChakraProvider>
  )
}

const rootRoute = new RootRoute()

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'src/index.html',
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

const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, chatRoute])])

const router = new ReactRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }
