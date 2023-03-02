import logo from '~/assets/logo.svg'
import { Link, LinkPropsOptions } from '@tanstack/react-router'

function NavLink(props: LinkPropsOptions & { text: string }) {
  const { text, ...linkProps } = props
  return (
    <Link
      className="rounded-[10px] w-full h-[50px] pl-5 flex flex-col justify-center"
      activeOptions={{ exact: true }}
      activeProps={{
        className: 'bg-[#4987FC]',
      }}
      inactiveProps={{
        className: 'bg-[#F2F2F2] bg-opacity-20',
      }}
      {...linkProps}
    >
      <span className="text-white font-medium text-sm">{text}</span>
    </Link>
  )
}

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
