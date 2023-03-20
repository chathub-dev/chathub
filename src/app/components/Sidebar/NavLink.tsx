import { Link, LinkPropsOptions } from '@tanstack/react-router'

function NavLink(props: LinkPropsOptions & { text: string }) {
  const { text, ...linkProps } = props
  return (
    <Link
      className="rounded-[10px] w-full h-[45px] pl-5 flex flex-col justify-center"
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

export default NavLink
