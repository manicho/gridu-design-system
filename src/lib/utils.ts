import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tokens.css registers this design system's named typography roles (text-label,
// text-caption, text-body-default, etc.) as Tailwind @theme `--text-*` entries.
// tailwind-merge's default config only recognizes Tailwind's built-in font-size keywords
// (sm/base/lg/...) — without this extension it buckets our custom role names into the
// generic "text color" conflict group instead, silently dropping the font-size class
// whenever a text-color utility is merged alongside it (e.g. `text-caption
// text-muted-foreground` collapsing to just `text-muted-foreground`).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-heading-page",
        "text-heading-section",
        "text-heading-subsection",
        "text-body-default",
        "text-body-secondary",
        "text-label",
        "text-caption",
        "text-numeric-tabular",
      ],
    },
  },
});

/** Merge conditional class names and dedupe conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
