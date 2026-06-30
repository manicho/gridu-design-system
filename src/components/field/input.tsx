import { cva } from "class-variance-authority";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type InputType = "text" | "email" | "password" | "tel" | "search" | "number";

// Every class below resolves to a tokens.css role (Features 04-06) or the `body-default`
// typography role (FR-011, FR-012). Hover has no dedicated color-system.md token for
// `input`, so it's resolved as a small foreground-tinted border shift — a documented
// exception (data-model.md), the same way `input` itself is documented as not changing on
// focus. Focus-visible reuses the same `ring` convention Button established (Feature 07).
const inputVariants = cva(
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-body-default text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive",
        false: "border-input hover:border-foreground/40",
      },
      readOnly: {
        true: "bg-muted-surface",
        false: "",
      },
    },
    defaultVariants: {
      invalid: false,
      readOnly: false,
    },
  },
);

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  type?: InputType;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Set internally by Field when an error is active (FR-005) — not typically passed
   *  directly by a consumer composing through Field. */
  invalid?: boolean;
};

export function Input({
  type = "text",
  leadingIcon,
  trailingIcon,
  invalid = false,
  readOnly,
  className,
  ...rest
}: InputProps) {
  const classes = cn(
    inputVariants({ invalid, readOnly: Boolean(readOnly) }),
    leadingIcon && "pl-9",
    trailingIcon && "pr-9",
    className,
  );

  const inputElement = <input type={type} readOnly={readOnly} className={classes} {...rest} />;

  if (!leadingIcon && !trailingIcon) {
    return inputElement;
  }

  // Icons are absolutely positioned and aria-hidden — the field's accessible name comes
  // solely from its label (Field), never the icon; padding above reserves each icon's
  // footprint so it never overlaps the input's text (FR-007, research.md Decision 6).
  // pointer-events-none on the icon wrapper lets a click near the icon still land on the
  // input itself, for cursor placement.
  return (
    <div className="relative">
      {leadingIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground"
        >
          {leadingIcon}
        </span>
      )}
      {inputElement}
      {trailingIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground"
        >
          {trailingIcon}
        </span>
      )}
    </div>
  );
}

export { inputVariants };
