import {
  FloatingFocusManager,
  FloatingList,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react'
import { fileOpen } from 'browser-fs-access'
import { cx } from '~/utils'
import { ClipboardEventHandler, FC, ReactNode, memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoBook, GoImage } from 'react-icons/go'
import { RiDeleteBackLine } from 'react-icons/ri'
import { Prompt } from '~services/prompts'
import Button from '../Button'
import PromptCombobox, { ComboboxContext } from '../PromptCombobox'
import PromptLibraryDialog from '../PromptLibrary/Dialog'
import TextInput from './TextInput'

interface Props {
  mode: 'full' | 'compact'
  onSubmit: (value: string, images?: File[]) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  actionButton?: ReactNode | null
  autoFocus?: boolean
  supportImageInput?: boolean
  maxRows?: number
  fullHeight?: boolean
  onHeightChange?: (height: number) => void
}

const ChatMessageInput: FC<Props> = (props) => {
  const { t } = useTranslation()
  const {
    placeholder = t('Use / to select prompts, Shift+Enter to add new line'),
    fullHeight = false,
    onHeightChange,
    ...restProps
  } = props

  const [value, setValue] = useState('')
  const [images, setImages] = useState<File[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [offset(15), flip(), shift()],
    placement: 'top-start',
    open: isComboboxOpen,
    onOpenChange: setIsComboboxOpen,
  })

  const floatingListRef = useRef([])

  const handleSelect = useCallback((p: Prompt) => {
    if (p.id === 'PROMPT_LIBRARY') {
      setIsPromptLibraryDialogOpen(true)
      setIsComboboxOpen(false)
    } else {
      setValue(p.prompt)
      setIsComboboxOpen(false)
      inputRef.current?.focus()
    }
  }, [])

  const listNavigation = useListNavigation(context, {
    listRef: floatingListRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    focusItemOnOpen: true,
    openOnArrowKeyDown: false,
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNavigation])

  const comboboxContext = useMemo(
    () => ({
      activeIndex,
      getItemProps,
      handleSelect,
      setIsComboboxOpen: (open: boolean) => {
        setIsComboboxOpen(open)
        if (open) {

        } else {
          inputRef.current?.focus()
        }
      },
    }),
    [activeIndex, getItemProps, handleSelect],
  )

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (value.trim() || images.length > 0) {
        props.onSubmit(value, images)
      }
      setValue('')
      setImages([])
    },
    [images, props, value],
  )

  const onValueChange = useCallback((v: string) => {
    setValue(v)
    setIsComboboxOpen(v === '/')
  }, [])

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

  const openPromptLibrary = useCallback(() => {
    setIsPromptLibraryDialogOpen(true)
  }, [])

  const selectImage = useCallback(async () => {
    const files = await fileOpen({
      mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
      extensions: ['.jpg', '.jpeg', '.png', '.gif'],
      multiple: true,
    })
    console.debug('📁 Selected files:', files.map(f => ({ name: f.name, size: f.size, lastModified: f.lastModified })))
    setImages(prev => {
      const newImages = [...prev, ...files]
      console.debug('🖼️ All images after selection:', newImages.map((f, i) => ({ 
        index: i, 
        name: f.name, 
        size: f.size, 
        lastModified: f.lastModified,
        sameAsFirst: i > 0 ? f === newImages[0] : false
      })))
      return newImages
    })
    inputRef.current?.focus()
  }, [])

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const onPaste: ClipboardEventHandler<HTMLTextAreaElement> = useCallback((event) => {
    const pastedFiles = event.clipboardData.files
    if (!pastedFiles.length) {
      return
    }
    const imageFiles = Array.from(pastedFiles).filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      event.preventDefault()
      setImages(prev => [...prev, ...imageFiles])
      inputRef.current?.focus()
    }
  }, [])

  return (
    <form className={cx('flex flex-row items-center gap-3', fullHeight && 'h-full', props.className)} onSubmit={onFormSubmit} ref={formRef}>
      {props.mode === 'full' && (
        <>
          <GoBook
            size={22}
            className="cursor-pointer text-secondary-text hover:text-primary-text transition-colors duration-200"
            onClick={openPromptLibrary}
            title="Prompt library"
          />
          {isPromptLibraryDialogOpen && (
            <PromptLibraryDialog
              isOpen={true}
              onClose={() => setIsPromptLibraryDialogOpen(false)}
              insertPrompt={insertTextAtCursor}
            />
          )}
          <ComboboxContext.Provider value={comboboxContext}>
            {isComboboxOpen && (
              <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
                <div ref={refs.setFloating} style={{ ...floatingStyles }} {...getFloatingProps()}>
                  <FloatingList elementsRef={floatingListRef}>
                    <PromptCombobox />
                  </FloatingList>
                </div>
              </FloatingFocusManager>
            )}
          </ComboboxContext.Provider>
          {props.supportImageInput && (
            <GoImage size={22} className="cursor-pointer text-secondary-text hover:text-primary-text transition-colors duration-200" onClick={selectImage} title="Image input" />
          )}
        </>
      )}
      <div className={cx("w-full flex flex-col justify-center", fullHeight && "h-full")} ref={refs.setReference} {...getReferenceProps()}>
        {images.length > 0 && (
          <div className="flex flex-row items-center flex-wrap w-full mb-1 gap-2">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-1 bg-primary-border dark:bg-secondary rounded-full px-2 py-1 border border-primary-border">
                <span className="text-xs text-primary-text font-semibold cursor-default truncate max-w-[100px]">{img.name}</span>
                <RiDeleteBackLine size={12} className="cursor-pointer text-secondary-text hover:text-primary-text transition-colors duration-200 hover:scale-110" onClick={() => removeImage(index)} />
              </div>
            ))}
          </div>
        )}
        <TextInput
          ref={inputRef}
          formref={formRef}
          name="input"
          disabled={props.disabled}
          placeholder={placeholder as string}
          value={value}
          onValueChange={onValueChange}
          autoFocus={props.autoFocus}
          onPaste={props.supportImageInput ? onPaste : undefined}
          maxRows={props.maxRows}
          fullHeight={fullHeight}
          onHeightChange={onHeightChange}
        />
      </div>
      {props.actionButton || <Button text="-" className="invisible" size={props.mode === 'full' ? 'normal' : 'tiny'} />}
    </form>
  )
}

export default memo(ChatMessageInput)
