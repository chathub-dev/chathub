import { Switch } from '@headlessui/react'
import { cx } from '~/utils'
import { FC } from 'react'

interface Props {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

const Toggle: FC<Props> = (props) => {
  return (
    <Switch
      checked={props.enabled}
      onChange={props.onChange}
      className={cx(
        props.enabled ? 'bg-primary-blue' : 'bg-secondary',
        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
      )}
    >
      <span
        className={cx(
          props.enabled ? 'translate-x-4' : 'translate-x-0',
          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        )}
      />
    </Switch>
  )
}

export default Toggle
