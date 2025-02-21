// src/app/components/Switch.tsx
import { FC } from 'react'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

const Switch: FC<Props> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`
        w-11 h-6 bg-gray-200 rounded-full peer 
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all
        peer-checked:bg-blue-600
      `}></div>
    </label>
  )
}

export default Switch