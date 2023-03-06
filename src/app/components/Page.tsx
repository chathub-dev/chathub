import { FC, PropsWithChildren } from 'react'

const PagePanel: FC<PropsWithChildren<{ title: string }>> = (props) => {
  return (
    <div className="flex flex-col overflow-hidden bg-white rounded-[35px] h-full">
      <div className="text-center border-b border-solid border-[rgb(237,237,237)] h-[80px] flex flex-col justify-center mx-10">
        <span className="font-semibold text-[#303030] text-lg">{props.title}</span>
      </div>
      <div className="mx-10 mt-10 h-full">{props.children}</div>
    </div>
  )
}

export default PagePanel
