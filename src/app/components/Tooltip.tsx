import * as ReactTooltip from '@radix-ui/react-tooltip'
import { FC, PropsWithChildren } from 'react'

const Tooltip: FC<PropsWithChildren<{ content: string }>> = (props) => {
  return (
    <ReactTooltip.Provider delayDuration={1}>
      <ReactTooltip.Root>
        <ReactTooltip.Trigger asChild>{props.children}</ReactTooltip.Trigger>
        <ReactTooltip.Portal>
          <ReactTooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={5}
          >
            {props.content}
            <ReactTooltip.Arrow className="fill-white" />
          </ReactTooltip.Content>
        </ReactTooltip.Portal>
      </ReactTooltip.Root>
    </ReactTooltip.Provider>
  )
}

export default Tooltip
