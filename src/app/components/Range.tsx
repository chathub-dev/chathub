import { FC } from 'react'

interface RangeProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

const Range: FC<RangeProps> = ({ value, onChange, min = 0, max = 2, step = 0.1, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 cursor-pointer"
      />
      <span className="min-w-[3ch]">{value.toFixed(1)}</span>
    </div>
  )
}

export default Range