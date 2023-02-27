import { Textarea, TextareaProps } from '@chakra-ui/react'
import { FC, KeyboardEventHandler, useCallback, useMemo, useState } from 'react'

type Props = TextareaProps & {
  onSubmitText?: (value: string) => void
}

const TextInput: FC<Props> = (props) => {
  const { onSubmitText, ...textareaProps } = props
  const [value, setValue] = useState('')
  const rows = useMemo(() => Math.min((value.match(/\n/g) || []).length + 1, 3), [value])

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (e.shiftKey) {
          setValue(value + '\n')
        } else {
          if (value.trim() === '') {
            return
          }
          onSubmitText?.(value)
          setValue('')
        }
      }
    },
    [onSubmitText, value],
  )

  return (
    <Textarea
      {...textareaProps}
      onKeyDown={onKeyDown}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      rows={rows}
      autoComplete="off"
      resize="none"
    />
  )
}

export default TextInput
