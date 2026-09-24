import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';

const COLLAPSE_LINE_THRESHOLD = 14;

const CodeSnippetBlock = ({ codeSnippet }) => {
  const [expanded, setExpanded] = useState(false);
  if (!codeSnippet?.code) return null;

  const lineCount = codeSnippet.code.split('\n').length;
  const isLong = lineCount > COLLAPSE_LINE_THRESHOLD;

  return (
    <div className="mt-3 w-full max-w-full overflow-hidden">
      <div className="w-full overflow-x-auto rounded-lg">
        <CodeBlock
          code={codeSnippet.code}
          language={codeSnippet.language}
          filename={codeSnippet.filename}
          maxHeight={isLong && !expanded ? '260px' : 'none'}
        />
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-body-sm font-semibold text-primary-container hover:underline"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show full snippet ({lineCount} lines) <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CodeSnippetBlock;