import cx from 'classnames'
import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { GoBook } from 'react-icons/go'
import Button from '../Button'
import PromptLibraryDialog from '../PromptLibrary/Dialog'
import TextInput from './TextInput'

interface Props {
  enablePromptLibrary: boolean
  onSubmit: (value: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  actionButton?: ReactNode | null
  autoFocus?: boolean
}

const ChatMessageInput: FC<Props> = (props) => {
  const [value, setValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)

  useEffect(() => {
    if (!props.disabled && props.autoFocus) {
      inputRef.current?.focus()
    }
  }, [props.autoFocus, props.disabled])

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (value.trim()) {
        props.onSubmit(value)
      }
      setValue('')
    },
    [props, value],
  )

  const insertTextAtCursor = useCallback(
    (text: string) => {
      const cursorPosition = inputRef.current?.selectionStart || 0
      const textBeforeCursor = value.slice(0, cursorPosition)
      const textAfterCursor = value.slice(cursorPosition)
      setValue(`${textBeforeCursor}${text}${textAfterCursor}`)
      setIsPromptLibraryDialogOpen(false)
      inputRef.current?.focus()
    },
    [value],
  )

  return (
    <form className={cx('flex flex-row items-center gap-3', props.className)} onSubmit={onFormSubmit} ref={formRef}>
      {props.enablePromptLibrary && (
        <>
          <GoBook
            size={22}
            color="#707070"
            className="cursor-pointer"
            onClick={() => setIsPromptLibraryDialogOpen(true)}
          />
          <PromptLibraryDialog
            isOpen={isPromptLibraryDialogOpen}
            onClose={() => setIsPromptLibraryDialogOpen(false)}
            insertPrompt={insertTextAtCursor}
          />
        </>
      )}
      <TextInput
        ref={inputRef}
        formref={formRef}
        name="input"
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={value}
        onValueChange={setValue}
      />
      {props.actionButton || <Button text="-" className="invisible" />}
    </form>
  )
}

export default memo(ChatMessageInput)
