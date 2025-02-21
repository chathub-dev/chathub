/* eslint-disable react/prop-types */

import { cx } from '~/utils'
import 'github-markdown-css'
import { FC, ReactNode, useEffect, memo, useMemo, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { BsClipboard } from 'react-icons/bs'
import ReactMarkdown from 'react-markdown'
import reactNodeToString from 'react-node-to-string'
import rehypeHighlight from 'rehype-highlight'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import supersub from 'remark-supersub'
import remarkDirective from 'remark-directive';
import Tooltip from '../Tooltip'
import './markdown.css'
import type { Pluggable } from 'unified';
import {
  CodeBlockProvider,
  useCodeBlockContext
} from './CodeBlockContext';
import CodeBlock from './Content/CodeBlock'


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
      <div className="bg-[#e6e7e8] dark:bg-[#444a5354] text-xs p-2">
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

export const handleDoubleClick: React.MouseEventHandler<HTMLElement> = (event) => {
  const range = document.createRange();
  range.selectNodeContents(event.target as Node);
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  selection.removeAllRanges();
  selection.addRange(range);
};

type TCodeProps = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const code: React.ElementType = memo(({ className, children }: TCodeProps) => {
  const match = /language-(\w+)/.exec(className ?? '');
  const lang = match && match[1];
  const isMath = lang === 'math';
  const isSingleLine = typeof children === 'string' && children.split('\n').length === 1;

  const { getNextIndex, resetCounter } = useCodeBlockContext();
  const blockIndex = useRef(getNextIndex(isMath || isSingleLine)).current;

  useEffect(() => {
    resetCounter();
  }, [children, resetCounter]);

  if (isMath) {
    return <>{children}</>;
  } else if (isSingleLine) {
    return (
      <code onDoubleClick={handleDoubleClick} className={className}>
        {children}
      </code>
    );
  } else {
    const codeString = typeof children === 'string' 
      ? children 
      : reactNodeToString(children);
    
    return <CodeBlock language={lang ?? 'text'} code={codeString} />;
  }
});



const Markdown: FC<{ children: string }> = ({ children }) => {
  const remarkPlugins: Pluggable[] = useMemo(
    () => [
      supersub,
      remarkGfm,
      remarkDirective,
      [remarkMath, { singleDollarTextMath: true }],
    ],
    [],
  );
  return (
    <CodeBlockProvider>
    <ReactMarkdown
      /** @ts-ignore */
      remarkPlugins={
        // [[remarkMath, { singleDollarTextMath: true }],remarkBreaks, remarkGfm]
        
        remarkPlugins
      }
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      className={`markdown-body markdown-custom-styles !text-base font-normal`}
      // linkTarget="_blank" // Deprecated at markdown 9.0.0
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
        code
      }}
    >
      {children}
    </ReactMarkdown>
    </CodeBlockProvider>
  )
}

export default Markdown
