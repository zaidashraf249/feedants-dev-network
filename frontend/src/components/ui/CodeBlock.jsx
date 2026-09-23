// import { Check, Copy, FileCode2 } from 'lucide-react';
// import useCopyClipboard from '../../hooks/useCopyClipboard';
// import { cn } from '../../utils/cn';

// /**
//  * Reusable code snippet viewer. Renders a dark editor-style chrome with
//  * a filename/language header and a one-click copy button powered by
//  * useCopyClipboard. Used inside feed posts, profile "Code Snippets"
//  * tab, and the post composer's live preview.
//  */
// const CodeBlock = ({ code = '', language = 'text', filename = '', className, maxHeight = '360px' }) => {
//   const { copied, copy } = useCopyClipboard();

//   return (
//     <div
//       className={cn(
//         'rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] text-[#e6edf3] font-mono text-body-sm',
//         className
//       )}
//     >
//       <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
//         <div className="flex items-center gap-2 min-w-0">
//           <FileCode2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
//           <span className="truncate text-[13px] text-white/70">{filename || language}</span>
//           <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-white/30 shrink-0">
//             {language}
//           </span>
//         </div>
//         <button
//           type="button"
//           onClick={() => copy(code)}
//           className="flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white transition-colors shrink-0"
//           aria-label="Copy code to clipboard"
//         >
//           {copied ? (
//             <>
//               <Check className="w-3.5 h-3.5 text-emerald-400" />
//               <span className="text-emerald-400">Copied</span>
//             </>
//           ) : (
//             <>
//               <Copy className="w-3.5 h-3.5" />
//               <span>Copy</span>
//             </>
//           )}
//         </button>
//       </div>
//       <pre className="overflow-x-auto p-4 leading-relaxed" style={{ maxHeight }}>
//         <code>{code}</code>
//       </pre>
//     </div>
//   );
// };

// export default CodeBlock;



import { Check, Copy, FileCode2 } from 'lucide-react';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import { cn } from '../../utils/cn';

/**
 * Reusable code snippet viewer. Renders a dark editor-style chrome with
 * a filename/language header and a one-click copy button powered by
 * useCopyClipboard. Used inside feed posts, profile "Code Snippets"
 * tab, and the post composer's live preview.
 */
const CodeBlock = ({ code = '', language = 'text', filename = '', className, maxHeight = '360px' }) => {
  const { copied, copy } = useCopyClipboard();

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] text-[#e6edf3] font-mono text-body-sm',
        className
      )}
      style={{ colorScheme: 'dark' }}
    >
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span className="truncate text-[13px] text-white/70">{filename || language}</span>
          <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-white/30 shrink-0">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white transition-colors shrink-0"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 leading-relaxed text-[#e6edf3]" style={{ maxHeight }}>
        <code className="text-[#e6edf3]">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;