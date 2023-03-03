import cx from 'classnames'
import logo from '~/assets/logo.svg'
import NavLink from './NavLink'
import feedbackIcon from '~/assets/icons/feedback.svg'
import settingIcon from '~/assets/icons/setting.svg'

function IconButton(props: { icon: string; active?: boolean }) {
  return (
    <div
      className={cx(
        'p-[6px] rounded-[10px] cursor-pointer hover:opacity-80',
        props.active ? 'bg-[#5E95FC]' : 'bg-[#f2f2f233]',
      )}
    >
      <img src={props.icon} className="w-6 h-6" />
    </div>
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
      <div className="mt-auto">
        <hr className="border-[#ffffff4d]" />
        <div className="flex flex-row mt-5 gap-[10px] mb-6">
          <a href="https://canny.io" target="_blank" rel="noreferrer">
            <IconButton icon={feedbackIcon} />
          </a>
          <IconButton icon={settingIcon} />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
