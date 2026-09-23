import { useCallback, useState } from 'react';

/**
 * Copies text to the clipboard and exposes a transient `copied` flag
 * that automatically resets after `resetDelay` ms — used by CodeBlock's
 * one-click copy button and any other "copy" affordance in the app.
 */
const useCopyClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch (error) {
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy };
};

export default useCopyClipboard;
