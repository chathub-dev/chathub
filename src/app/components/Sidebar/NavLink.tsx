import { Link, LinkPropsOptions } from '@tanstack/react-router'
import cx from 'classnames'

function NavLink(props: LinkPropsOptions & { text: string; icon: any; iconOnly?: boolean }) {
  const { text, icon, iconOnly, ...linkProps } = props
  return (
    <Link
      className={cx(
        'rounded-[10px] w-full pl-3 flex flex-row gap-3 items-center shrink-0 py-[11px]',
        iconOnly && 'justify-center',
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
      {<span className="font-medium text-sm">{iconOnly ? '' : text}</span>}
    </Link>
  )
}

export default NavLink
