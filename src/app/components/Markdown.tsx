/* eslint-disable react/prop-types */
import 'github-markdown-css/github-markdown-light.css'
import 'highlight.js/styles/github.css'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import classes from './Chat/markdown.module.css'
import Tooltip from './Tooltip'

const Markdown: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[supersub, remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true }]]}
      className={`markdown-body ${classes.markdown} !text-base font-normal`}
      linkTarget="_blank"
      components={{
        a: ({ node, ...props }) => {
          if (!props.title) {
            return <a {...props} />
          }
          return (
            <Tooltip content={props.title}>
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
