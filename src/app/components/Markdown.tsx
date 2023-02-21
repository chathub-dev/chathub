import { Tooltip } from '@chakra-ui/react'
import 'github-markdown-css'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import classes from './Chat/card.module.css'

const Markdown: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[supersub, remarkGfm]}
      className={`markdown-body ${classes.markdown}`}
      linkTarget="_blank"
      components={{
        a: ({ node, ...props }) => {
          if (!props.title) {
            return <a {...props} />
          }
          return (
            <Tooltip label={props.title} placement="top">
              <a {...props} title={undefined} />
            </Tooltip>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
