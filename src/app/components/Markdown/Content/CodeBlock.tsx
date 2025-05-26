import React, { useState } from 'react';
import styled from 'styled-components';
import { Prism, SyntaxHighlighterProps } from 'react-syntax-highlighter'; // SyntaxHighlighterProps もインポート
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 型アサーションを使用して型エラーを回避
const SyntaxHighlighter = (Prism as any) as React.FC<SyntaxHighlighterProps>;
import { CopyToClipboard } from 'react-copy-to-clipboard-ts';
import { FiCopy, FiCheck, FiMaximize2, FiX } from 'react-icons/fi';

interface Props {
  code: string;
  language: string;
}

const CodeBlock: React.FC<Props> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      <Container>
        <CodeBar>
          <Language>{language}</Language>
          <ButtonGroup>
            <ExpandButton onClick={handleExpand}>
              <FiMaximize2 />
            </ExpandButton>
            <CopyToClipboard text={code} onCopy={handleCopy}>
              <CopyButton>
                {copied ? <FiCheck /> : <FiCopy />}
              </CopyButton>
            </CopyToClipboard>
          </ButtonGroup>
        </CodeBar>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          wrapLines={true}
          lineProps={{ style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }}
        >
            {code}
        </SyntaxHighlighter>
      </Container>

      {isExpanded && (
        <ExpandedOverlay onClick={handleClose}>
          <ExpandedContainer onClick={(e) => e.stopPropagation()}>
            <ExpandedCodeBar>
              <Language>{language}</Language>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ExpandedCodeBar>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{ margin: 0, flexGrow: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
              wrapLines={true} // wrapLines を維持しつつ lineProps も試す
              lineProps={{ style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }} // 各行にスタイルを適用
            >
                {code}
            </SyntaxHighlighter>
          </ExpandedContainer>
        </ExpandedOverlay>
      )}
    </>
  );
};

const Container = styled.div`
  border: 1px solid #2d2d2d;
  border-radius: 4px;
  overflow: auto; // Keep overflow auto
  /* white-space and word-break are now applied via customStyle */
`;

const CodeBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  padding: 8px 16px;
  border-bottom: 1px solid #2d2d2d;
`;

const Language = styled.span`
  color: #fff;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #0066cc;
  }
`;

const CopyButton = styled(Button)``;
const ExpandButton = styled(Button)``;
const CloseButton = styled(Button)``;

const ExpandedOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ExpandedContainer = styled.div`
  width: 90%;
  height: 90%;
  background-color: #1e1e1e;
  border-radius: 4px;
  overflow: auto; // Keep overflow auto
  /* white-space and word-break are now applied via customStyle */
  display: flex;
  flex-direction: column;
`;

const ExpandedCodeBar = styled(CodeBar)`
  padding: 12px 20px;
`;

export default CodeBlock;