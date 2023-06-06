import { FC, useId } from 'react'

interface Option {
  label: string
  value: string
}

const RadioItem = (props: { option: Option; checked: boolean; onChange: (v: string) => void }) => {
  const id = useId()
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="radio"
        checked={props.checked}
        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
        value={props.option.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      />
      <label htmlFor={id} className="ml-2 block text-sm font-medium leading-6">
        {props.option.label}
      </label>
    </div>
  )
}

interface Props {
  options: Option[]
  value: string
  onChange: (v: string) => void
}

const RadioGroup: FC<Props> = (props) => {
  return (
    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-3 mb-1">
      {props.options.map((option) => (
        <RadioItem
          key={option.value}
          option={option}
          checked={option.value === props.value}
          onChange={props.onChange}
        />
      ))}
    </div>
  )
}

export default RadioGroup
