import logo from '~/assets/logo.svg'
import NavLink from './NavLink'

function Sidebar() {
  return (
    <aside className="flex flex-col pr-5">
      <img src={logo} className="w-[79px] mb-[55px] mt-[66px] ml-5" />
      <div className="flex flex-col gap-3">
        <NavLink to="/" text="All in one" />
        <NavLink to="/chat/$botId" params={{ botId: 'chatgpt' }} text="ChatGPT" />
        <NavLink to="/chat/$botId" params={{ botId: 'bing' }} text="Bing" />
      </div>
    </aside>
  )
}

export default Sidebar
