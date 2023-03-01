import logo from '~/assets/logo.svg'
import { Link } from '@tanstack/react-router'

function Sidebar() {
  return (
    <aside className="bg-gray-900 p-5 flex flex-col text-white">
      <img src={logo} className="w-2/3" />
      <div className="mt-10 flex flex-col gap-3">
        <span>
          <Link to="/">All-in-One</Link>
        </span>
        <span>
          <Link to="/chat/$botId" params={{ botId: 'chatgpt' }}>
            ChatGPT
          </Link>
        </span>
        <span>
          <Link to="/chat/$botId" params={{ botId: 'bing' }}>
            Bing
          </Link>
        </span>
      </div>
    </aside>
  )
}

export default Sidebar
