import { Link, LinkPropsOptions } from '@tanstack/react-router'

function NavLink(props: LinkPropsOptions & { text: string }) {
  const { text, ...linkProps } = props
  return (
    <Link
      className="rounded-[10px] w-full h-[45px] pl-5 flex flex-col justify-center"
      activeOptions={{ exact: true }}
      activeProps={{
        className: 'bg-[var(--bg-1)]',
      }}
      inactiveProps={{
        className: 'bg-[var(--bg-6)]',
      }}
      {...linkProps}
    >
      <span className="text-white font-medium text-sm">{text}</span>
    </Link>
  )
}

export default NavLink
