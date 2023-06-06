import { Suspense, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BeatLoader } from 'react-spinners'
import useSWR from 'swr'
import closeIcon from '~/assets/icons/close.svg'
import { trackEvent } from '~app/plausible'
import { Prompt, loadLocalPrompts, loadRemotePrompts, removeLocalPrompt, saveLocalPrompt } from '~services/prompts'
import { uuid } from '~utils'
import Button from '../Button'
import { Input, Textarea } from '../Input'
import Tabs, { Tab } from '../Tabs'

const ActionButton = (props: { text: string; onClick: () => void }) => {
  return (
    <a
      className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
      onClick={props.onClick}
    >
      {props.text}
    </a>
  )
}

const PromptItem = (props: {
  title: string
  prompt: string
  edit?: () => void
  remove?: () => void
  copyToLocal?: () => void
  insertPrompt: (text: string) => void
}) => {
  const { t } = useTranslation()
  const [saved, setSaved] = useState(false)

  const copyToLocal = useCallback(() => {
    props.copyToLocal?.()
    setSaved(true)
  }, [props])

  return (
    <div className="group relative flex items-center space-x-3 rounded-lg border border-primary-border bg-primary-background px-5 py-4 shadow-sm hover:border-gray-400">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-primary-text">{props.title}</p>
      </div>
      <div className="flex flex-row gap-1">
        {props.edit && <ActionButton text={t('Edit')} onClick={props.edit} />}
        {props.copyToLocal && <ActionButton text={t(saved ? 'Saved' : 'Save')} onClick={copyToLocal} />}
        <ActionButton text={t('Use')} onClick={() => props.insertPrompt(props.prompt)} />
      </div>
      {props.remove && (
        <img
          src={closeIcon}
          className="hidden group-hover:block absolute right-[-8px] top-[-8px] cursor-pointer w-4 h-4 rounded-full bg-primary-background"
          onClick={props.remove}
        />
      )}
    </div>
  )
}

function PromptForm(props: { initialData: Prompt; onSubmit: (data: Prompt) => void; onClose: () => void }) {
  const { t } = useTranslation()

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const formdata = new FormData(e.currentTarget)
      const json = Object.fromEntries(formdata.entries())
      if (json.title && json.prompt) {
        props.onSubmit({
          id: props.initialData.id,
          title: json.title as string,
          prompt: json.prompt as string,
        })
      }
    },
    [props],
  )

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1 text-primary-text">Prompt {t('Title')}</span>
        <Input className="w-full" name="title" defaultValue={props.initialData.title} />
      </div>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1 text-primary-text">Prompt {t('Content')}</span>
        <Textarea className="w-full" name="prompt" defaultValue={props.initialData.prompt} />
      </div>
      <div className="flex flex-row gap-2 mt-1">
        <Button color="primary" text={t('Save')} className="w-fit" size="small" type="submit" />
        <Button color="flat" text={t('Cancel')} className="w-fit" size="small" onClick={props.onClose} />
      </div>
    </form>
  )
}

function LocalPrompts(props: { insertPrompt: (text: string) => void }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Prompt | null>(null)
  const localPromptsQuery = useSWR('local-prompts', () => loadLocalPrompts(), { suspense: true })

  const savePrompt = useCallback(
    async (prompt: Prompt) => {
      const existed = await saveLocalPrompt(prompt)
      localPromptsQuery.mutate()
      setFormData(null)
      trackEvent(existed ? 'edit_local_prompt' : 'add_local_prompt')
    },
    [localPromptsQuery],
  )

  const removePrompt = useCallback(
    async (id: string) => {
      await removeLocalPrompt(id)
      localPromptsQuery.mutate()
      trackEvent('remove_local_prompt')
    },
    [localPromptsQuery],
  )

  const create = useCallback(() => {
    setFormData({ id: uuid(), title: '', prompt: '' })
  }, [])

  return (
    <>
      {localPromptsQuery.data.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          {localPromptsQuery.data.map((prompt) => (
            <PromptItem
              key={prompt.id}
              title={prompt.title}
              prompt={prompt.prompt}
              edit={() => !formData && setFormData(prompt)}
              remove={() => removePrompt(prompt.id)}
              insertPrompt={props.insertPrompt}
            />
          ))}
        </div>
      ) : (
        <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-3 text-center text-sm mt-5 text-primary-text">
          You have no prompts.
        </div>
      )}
      <div className="mt-5">
        {formData ? (
          <PromptForm initialData={formData} onSubmit={savePrompt} onClose={() => setFormData(null)} />
        ) : (
          <Button text={t('Create new prompt')} size="small" onClick={create} />
        )}
      </div>
    </>
  )
}

function CommunityPrompts(props: { insertPrompt: (text: string) => void }) {
  const promptsQuery = useSWR('community-prompts', () => loadRemotePrompts(), { suspense: true })

  const copyToLocal = useCallback(async (prompt: Prompt) => {
    await saveLocalPrompt({ ...prompt, id: uuid() })
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        {promptsQuery.data.map((prompt, index) => (
          <PromptItem
            key={index}
            title={prompt.title}
            prompt={prompt.prompt}
            insertPrompt={props.insertPrompt}
            copyToLocal={() => copyToLocal(prompt)}
          />
        ))}
      </div>
      <span className="text-sm mt-5 block text-primary-text">
        Contribute on{' '}
        <a
          href="https://github.com/chathub-dev/community-prompts"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          GitHub
        </a>{' '}
        or{' '}
        <a href="https://openprompt.co/?utm_source=chathub" target="_blank" rel="noreferrer" className="underline">
          OpenPrompt
        </a>
      </span>
    </>
  )
}

const PromptLibrary = (props: { insertPrompt: (text: string) => void }) => {
  const { t } = useTranslation()

  const insertPrompt = useCallback(
    (text: string) => {
      props.insertPrompt(text)
      trackEvent('use_prompt')
    },
    [props],
  )

  const tabs = useMemo<Tab[]>(
    () => [
      { name: t('Your Prompts'), value: 'local' },
      { name: t('Community Prompts'), value: 'community' },
    ],
    [t],
  )

  return (
    <Tabs
      tabs={tabs}
      renderTab={(tab: (typeof tabs)[0]['value']) => {
        if (tab === 'local') {
          return (
            <Suspense fallback={<BeatLoader size={10} className="mt-5" color="rgb(var(--primary-text))" />}>
              <LocalPrompts insertPrompt={insertPrompt} />
            </Suspense>
          )
        }
        if (tab === 'community') {
          return (
            <Suspense fallback={<BeatLoader size={10} className="mt-5" color="rgb(var(--primary-text))" />}>
              <CommunityPrompts insertPrompt={insertPrompt} />
            </Suspense>
          )
        }
      }}
    />
  )
}

export default PromptLibrary
