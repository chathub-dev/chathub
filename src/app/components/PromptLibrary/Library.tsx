import useSWR from 'swr'
import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { saveLocalPrompt, loadLocalPrompts, loadRemotePrompts, removeLocalPrompt, Prompt } from '~services/prompts'
import Button from '../Button'
import { useCallback, useState } from 'react'
import { Input, Textarea } from '../Input'
import { uuid } from '~utils'
import { BeatLoader } from 'react-spinners'
import { trackEvent } from '~app/plausible'

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
  insertPrompt: (text: string) => void
}) => {
  return (
    <div className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{props.title}</p>
      </div>
      <div className="flex flex-row gap-1">
        {props.edit && <ActionButton text="Edit" onClick={props.edit} />}
        <ActionButton text="Use" onClick={() => props.insertPrompt(props.prompt)} />
      </div>
      {props.remove && (
        <IoIosCloseCircleOutline
          className="hidden group-hover:block absolute right-[-8px] top-[-8px] bg-white cursor-pointer"
          size={20}
          onClick={props.remove}
        />
      )}
    </div>
  )
}

function PromptForm(props: { initialData: Prompt; onSubmit: (data: Prompt) => void }) {
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
    <form className="flex flex-col gap-2 w-1/2" onSubmit={onSubmit}>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1">Prompt Title</span>
        <Input className="w-full" name="title" defaultValue={props.initialData.title} />
      </div>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1">Prompt Content</span>
        <Textarea className="w-full" name="prompt" defaultValue={props.initialData.prompt} />
      </div>
      <Button color="primary" text="Save" className="w-fit" size="small" type="submit" />
    </form>
  )
}

function LocalPrompts(props: { insertPrompt: (text: string) => void }) {
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
              edit={() => setFormData(prompt)}
              remove={() => removePrompt(prompt.id)}
              insertPrompt={props.insertPrompt}
            />
          ))}
        </div>
      ) : (
        <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-3 text-center text-sm mt-5">
          You have no prompts.
        </div>
      )}
      <div className="mt-5">
        {formData ? (
          <PromptForm initialData={formData} onSubmit={savePrompt} />
        ) : (
          <Button text="Create new prompt" size="small" onClick={create} />
        )}
      </div>
    </>
  )
}

function CommunityPrompts(props: { insertPrompt: (text: string) => void }) {
  const promptsQuery = useSWR('community-prompts', () => loadRemotePrompts(), { suspense: true })
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        {promptsQuery.data.map((prompt, index) => (
          <PromptItem key={index} title={prompt.title} prompt={prompt.prompt} insertPrompt={props.insertPrompt} />
        ))}
      </div>
      <span className="text-sm mt-5 block">
        Contribute on{' '}
        <a
          href="https://github.com/chathub-dev/community-prompts"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </span>
    </>
  )
}

const PromptLibrary = (props: { insertPrompt: (text: string) => void }) => {
  const insertPrompt = useCallback(
    (text: string) => {
      props.insertPrompt(text)
      trackEvent('use_prompt')
    },
    [props],
  )
  return (
    <Tabs defaultValue="local" className="w-full">
      <TabsList>
        <TabsTrigger value="local">Your Prompts</TabsTrigger>
        <TabsTrigger value="community">Community Prompts</TabsTrigger>
      </TabsList>
      <TabsContent value="local">
        <Suspense fallback={<BeatLoader size={10} className="mt-5" />}>
          <LocalPrompts insertPrompt={insertPrompt} />
        </Suspense>
      </TabsContent>
      <TabsContent value="community">
        <Suspense fallback={<BeatLoader size={10} className="mt-5" />}>
          <CommunityPrompts insertPrompt={insertPrompt} />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

export default PromptLibrary
