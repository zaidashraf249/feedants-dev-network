import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';

const COLLAPSE_LINE_THRESHOLD = 14;

/**
 * Wraps the generic ui/CodeBlock with feed-specific behavior: snippets
 * longer than a threshold start collapsed with a "Show more" affordance
 * so the feed stays scannable.
 */
const CodeSnippetBlock = ({ codeSnippet }) => {
  const [expanded, setExpanded] = useState(false);
  if (!codeSnippet?.code) return null;

  const lineCount = codeSnippet.code.split('\n').length;
  const isLong = lineCount > COLLAPSE_LINE_THRESHOLD;

  return (
    <div className="mt-3">
      <CodeBlock
        code={codeSnippet.code}
        language={codeSnippet.language}
        filename={codeSnippet.filename}
        maxHeight={isLong && !expanded ? '260px' : 'none'}
      />
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
