import { Link } from '@tanstack/react-router'

function Sidebar() {
  return (
    <aside className="bg-gray-900 p-5 flex flex-col text-white">
      <span className="font-bold">ChatHub</span>
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
      <span className="mt-auto"></span>
      <div>
        <p>Feedback</p>
        <p>About</p>
      </div>
    </aside>
  )
}

export default Sidebar
