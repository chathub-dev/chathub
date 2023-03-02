/* eslint-disable react/prop-types */
import 'github-markdown-css/github-markdown-light.css'
import { Tooltip } from 'react-tooltip'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import classes from './Chat/markdown.module.css'
import { uuid } from '~utils'

const Markdown: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[supersub, remarkGfm]}
      className={`markdown-body ${classes.markdown} !text-base font-normal`}
      linkTarget="_blank"
      components={{
        a: ({ node, ...props }) => {
          if (!props.title) {
            return <a {...props} />
          }
          const id = uuid()
          return (
            <>
              <a {...props} title={undefined} data-tooltip-id={id} data-tooltip-content={props.title} />
              <Tooltip id={id} />
            </>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
