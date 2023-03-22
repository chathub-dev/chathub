import useSWR from 'swr'
import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { addLocalPrompt, loadLocalPrompts, loadRemotePrompts, removeLocalPrompt } from '~services/prompts'
import Button from '../Button'
import { useCallback, useState } from 'react'
import { Input, Textarea } from '../Input'
import { uuid } from '~utils'
import { BeatLoader } from 'react-spinners'
import { trackEvent } from '~app/plausible'

const PromptItem = (props: {
  title: string
  prompt: string
  remove?: () => void
  insertPrompt: (text: string) => void
}) => {
  return (
    <div className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-300">{props.title}</p>
      </div>
      <div>
        <a
          className="inline-flex items-center rounded-full bg-white dark:bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
          onClick={() => props.insertPrompt(props.prompt)}
        >
          Use
        </a>
      </div>
      {props.remove && (
        <IoIosCloseCircleOutline
          className="hidden group-hover:block absolute right-[-8px] top-[-8px] bg-white dark:bg-gray-800 cursor-pointer"
          size={20}
          onClick={props.remove}
        />
      )}
    </div>
  )
}

function CreatePromptForm(props: { onSubmit: (title: string, prompt: string) => void }) {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const formdata = new FormData(e.currentTarget)
      const json = Object.fromEntries(formdata.entries())
      if (json.title && json.prompt) {
        props.onSubmit(json.title as string, json.prompt as string)
      }
    },
    [props],
  )
  return (
    <form className="flex flex-col gap-2 w-1/2" onSubmit={onSubmit}>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1">Prompt Title</span>
        <Input className="w-full" name="title" />
      </div>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1">Prompt Content</span>
        <Textarea className="w-full" name="prompt" />
      </div>
      <Button color="primary" text="Create" className="w-fit" size="small" type="submit" />
    </form>
  )
}

function LocalPrompts(props: { insertPrompt: (text: string) => void }) {
  const [showForm, setShowForm] = useState(false)
  const localPromptsQuery = useSWR('local-prompts', () => loadLocalPrompts(), { suspense: true })

  const createPrompt = useCallback(
    async (title: string, prompt: string) => {
      await addLocalPrompt({ id: uuid(), title, prompt })
      localPromptsQuery.mutate()
      setShowForm(false)
      trackEvent('add_local_prompt')
    },
    [localPromptsQuery],
  )

  const removePrompt = useCallback(
    async (id: string) => {
      await removeLocalPrompt(id)
      localPromptsQuery.mutate()
    },
    [localPromptsQuery],
  )

  return (
    <>
      {localPromptsQuery.data.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          {localPromptsQuery.data.map((prompt) => (
            <PromptItem
              key={prompt.id}
              title={prompt.title}
              prompt={prompt.prompt}
              remove={() => removePrompt(prompt.id)}
              insertPrompt={props.insertPrompt}
            />
          ))}
        </div>
      ) : (
        <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:text-white dark:border-gray-700 p-3 text-center text-sm mt-5">
          You have no prompts.
        </div>
      )}
      <div className="mt-5">
        {showForm ? (
          <CreatePromptForm onSubmit={createPrompt} />
        ) : (
          <Button text="Create new prompt" size="small" onClick={() => setShowForm(true)} />
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
      <span className="text-sm mt-5 block dark:text-white">
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
