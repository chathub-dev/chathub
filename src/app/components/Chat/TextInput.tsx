import { cx } from '~/utils'
import React, { KeyboardEventHandler, useCallback, useImperativeHandle, useRef } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

type Props = TextareaAutosizeProps & {
  onValueChange: (value: string) => void
  formref?: React.RefObject<HTMLFormElement>
  fullHeight?: boolean // 親要素の高さに合わせるかどうか
  onHeightChange?: (height: number) => void // 高さ変化のコールバック
}

const TextInput = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const {
    className,
    value = '',
    onValueChange,
    minRows = 1,
    maxRows = 12,
    formref,
    disabled,
    fullHeight = false,
    onHeightChange,
    ...textareaProps
  } = props as Props & { value: string }

  const inputRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => inputRef.current!)

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        if (e.shiftKey) {
          const pos = inputRef.current?.selectionStart || 0
          onValueChange(`${value.slice(0, pos)}\n${value.slice(pos)}`)
          setTimeout(() => {
            inputRef.current!.setSelectionRange(pos + 1, pos + 1)
          }, 0)
        } else if (!disabled) {
          formref?.current?.requestSubmit()
        }
      }
    },
    [disabled, formref, onValueChange, value],
  )

  if (fullHeight) {
    return (
      <div className="w-full h-full flex items-center">
        <textarea
          ref={inputRef}
          className={cx(
            'resize-none overflow-x-hidden overflow-y-auto w-full outline-none text-sm text-primary-text bg-transparent scrollbar-thin',
            disabled && 'cursor-wait',
            className,
          )}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          autoComplete="off"
          disabled={disabled}
          style={{ minHeight: '1.5em' }} // 最小高さを設定して中央揃えを維持
          {...textareaProps}
        />
      </div>
    )
  }

  return (
    <TextareaAutosize
      ref={inputRef}
      className={cx(
        'resize-none overflow-x-hidden overflow-y-auto w-full max-h-full outline-none text-sm text-primary-text bg-transparent scrollbar-thin',
        disabled && 'cursor-wait',
        className,
      )}
      onKeyDown={onKeyDown}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      onHeightChange={onHeightChange}
      autoComplete="off"
      minRows={minRows}
      maxRows={maxRows}
      {...textareaProps}
    />
  )
})

TextInput.displayName = 'TextInput'

export default TextInput
