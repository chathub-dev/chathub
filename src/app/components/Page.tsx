import { FC, PropsWithChildren } from 'react'

const PagePanel: FC<PropsWithChildren<{ title: string }>> = (props) => {
  return (
    <div className="flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-[35px] h-full">
      <div className="text-center border-b border-solid border-[var(--border-1)] h-[80px] flex flex-col justify-center mx-10">
        <span className="font-semibold text-[var(--text-1)] text-lg">{props.title}</span>
      </div>
      <div className="mx-10 h-full overflow-auto pl-[2px]">{props.children}</div>
    </div>
  )
}

export default PagePanel
