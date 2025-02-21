import { Link, LinkOptions } from '@tanstack/react-router'
import { cx } from '~/utils'

function NavLink(props: LinkOptions & { text: string; icon: any; iconOnly?: boolean; shortText?: string }) {
  const { text, icon, iconOnly, shortText, ...linkProps } = props

  return (
    <Link
      className={cx(
        'rounded-[10px] w-full pl-3 flex items-center shrink-0',
        iconOnly 
          ? 'flex-col justify-center items-center gap-1 px-1 py-[5px]' // 縦方向の配置に変更
          : 'flex-row gap-3 py-[11px]'
      )}
      activeOptions={{ exact: true }}
      activeProps={{ className: 'bg-white text-primary-text dark:bg-primary-blue' }}
      inactiveProps={{
        className: 'bg-secondary bg-opacity-20 text-primary-text opacity-80 hover:opacity-100',
      }}
      title={text}
      {...linkProps}
    >
      <img src={icon} className="w-5 h-5" />
      <span
        className={cx(
          'font-medium text-sm',
          iconOnly && 'overflow-hidden text-ellipsis leading-tight text-center break-words w-full'
        )}
      >
        {iconOnly ? shortText || text.slice(0, 4) : text}
      </span>
    </Link>
  )
}

export default NavLink
