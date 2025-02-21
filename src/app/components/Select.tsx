import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { cx } from '~/utils'
import { Fragment, useMemo, useRef, useState, useEffect } from 'react'

interface Props<T> {
  options: { value: T; name: string; icon?: string }[] // iconプロパティを追加
  value: T
  onChange: (value: T) => void
  size?: 'normal' | 'small'
  disabled?: boolean
  position?: 'top' | 'down'
  showIcon?: boolean // アイコン表示制御用のプロパティを追加
}

function Select<T extends string>(props: Props<T>) {
  const { options, value, onChange, size = 'normal', disabled, position, showIcon = false } = props
  const selectedOption = useMemo(() => options.find((o) => o.value === value)!, [options, value])
  
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropPosition, setDropPosition] = useState<'top' | 'down'>('down')

  // ドロップダウンの位置を計算する関数
  const calculatePosition = () => {
    if (position) {
      setDropPosition(position)
      return
    }

    if (!buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const spaceBelow = windowHeight - buttonRect.bottom
    const spaceAbove = buttonRect.top

    // 下のスペースが170px未満で、上のスペースの方が大きい場合は上に表示
    if (spaceBelow < 170 && spaceAbove > spaceBelow) {
      setDropPosition('top')
    } else {
      setDropPosition('down')
    }
  }

  useEffect(() => {
    // 初回レンダリング時に位置を計算
    calculatePosition()

    // ウィンドウのリサイズ時にも位置を再計算
    window.addEventListener('resize', calculatePosition)
    return () => window.removeEventListener('resize', calculatePosition)
  }, [position])

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button
              ref={buttonRef}
              className={cx(
                'relative w-full cursor-default rounded-md bg-white pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none leading-6',
                size === 'normal' ? 'text-sm py-1.5' : 'text-xs py-1',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              onClick={calculatePosition}
            >
              <div className="flex items-center gap-2">
                {showIcon && selectedOption?.icon && (
                  <img src={selectedOption.icon} alt="" className="w-5 h-5" />
                )}
                <span className="block truncate">{selectedOption?.name || 'Select an option'}</span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={cx(
                  'absolute z-10 mt-1 max-h-80	 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                  size === 'normal' ? 'text-sm' : 'text-xs',
                  dropPosition === 'top' && 'bottom-full mb-1',
                )}
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      cx(
                        active ? 'bg-primary-blue text-white' : 'text-[#303030]',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      )
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center gap-2">
                        {showIcon && option.icon && (
                          <img src={option.icon} alt="" className="w-5 h-5" />
                        )}
                        <span className={cx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {option.name}
                        </span>
                        {selected ? (
                          <span
                            className={cx(
                              active ? 'text-white' : 'text-[#303030]',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default Select
