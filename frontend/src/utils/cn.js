import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge doesn't know about custom theme keys out of the box.
 * Our fontSize scale (tailwind.config.js) uses names like `body-sm` /
 * `label-sm`, which share Tailwind's `text-` prefix with color
 * utilities (`text-red-500`, `text-[#hex]`). Without this extension,
 * twMerge treats a size class and a color class as the SAME conflict
 * group and silently drops whichever comes first — e.g. `text-[#e6edf3]
 * text-body-sm` collapses to just `text-body-sm`, losing the color
 * entirely. Registering our custom sizes under the `font-size` group
 * fixes that so size and color utilities never clobber each other.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-xl',
            'display-xl-mobile',
            'headline-lg',
            'headline-lg-mobile',
            'headline-md',
            'headline-sm',
            'title-md',
            'body-lg',
            'body-md',
            'body-sm',
            'label-md',
            'label-sm',
          ],
        },
      ],
    },
  },
});

/**
 * Combines conditional class names (clsx) and resolves conflicting
 * Tailwind utility classes (tailwind-merge) — the standard `cn` helper
 * used throughout components/ui.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

export default cn;