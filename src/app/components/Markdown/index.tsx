/* eslint-disable react/prop-types */

import cx from 'classnames'
import 'github-markdown-css/github-markdown-light.css'
import 'highlight.js/styles/github.css'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { BsClipboard } from 'react-icons/bs'
import ReactMarkdown from 'react-markdown'
import reactNodeToString from 'react-node-to-string'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import Tooltip from '../Tooltip'
import './markdown.css'

function CustomCode(props: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)

  const code = useMemo(() => reactNodeToString(props.children), [props.children])

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  return (
    <div className="flex flex-col">
      <div className="bg-[#e6e7e8] text-xs p-2">
        <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
          <div className="flex flex-row items-center gap-2 cursor-pointer w-fit ml-1">
            <BsClipboard />
            <span>{copied ? 'copied' : 'copy code'}</span>
          </div>
        </CopyToClipboard>
      </div>
      <code className={cx(props.className, 'px-4')}>{props.children}</code>
    </div>
  )
}

const Markdown: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[supersub, remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      className={`markdown-body markdown-custom-styles !text-base font-normal`}
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
        code: ({ node, inline, className, children, ...props }) => {
          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
          console.log(node, props)
          return <CustomCode className={className}>{children}</CustomCode>
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
