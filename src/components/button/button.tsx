import { cva } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import { cn } from "../../lib/utils";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost";
export type ButtonSize = "sm" | "default" | "lg";

// Every utility class below resolves to a tokens.css role (Features 04-06) — no ad-hoc
// color or typography value is introduced here (FR-002, FR-003). The focus ring is built
// on --ring (already a tokens.css role) and only ever appears for keyboard/AT focus, never
// a mouse click, because it's gated by the :focus-visible pseudo-class, not :focus (FR-006).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-primary-foreground hover:bg-brand-strong active:bg-brand-strong",
        secondary:
          "bg-muted-surface text-foreground hover:bg-muted-surface/80 active:bg-muted-surface/70",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-input bg-transparent hover:bg-muted-surface active:bg-muted-surface/80",
        ghost: "hover:bg-muted-surface active:bg-muted-surface/80",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type CommonButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  /** Polymorphic element — render as a native button or an anchor (FR-011). */
  as?: "button" | "a";
};

type SharedHtmlProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof CommonButtonProps | "children"
>;

// Text/children mode: accessible name comes from visible children by default. aria-label
// stays a normal optional pass-through (not forbidden) — a consumer may still override the
// accessible name, e.g. when truncated text alone isn't descriptive enough.
export type TextButtonProps = CommonButtonProps &
  SharedHtmlProps & {
    children: ReactNode;
    icon?: never;
  };

// Icon-only mode: no visible children, so the accessible name MUST come from aria-label —
// required at the type level, not left to runtime discipline (FR-010, research.md Decision 6).
export type IconOnlyButtonProps = CommonButtonProps &
  SharedHtmlProps & {
    children?: never;
    icon: ReactNode;
    "aria-label": string;
  };

export type ButtonProps = TextButtonProps | IconOnlyButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    disabled,
    loading = false,
    leadingIcon,
    trailingIcon,
    className,
    as = "button",
    onClick,
    children,
    icon,
    ...rest
  } = props;

  const isInactive = Boolean(disabled) || loading;
  const isIconOnly = icon !== undefined;

  const classes = cn(
    buttonVariants({ variant, size }),
    isIconOnly && "aspect-square p-0",
    loading && "cursor-wait",
    className,
  );

  // Loading takes visual/semantic precedence over disabled when both are set (Edge Case
  // ruling): the spinner replaces content and aria-busy communicates "in progress" rather
  // than the plain "unavailable" a disabled button conveys (FR-008).
  const content = loading ? (
    <>
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      <span className="sr-only">Loading</span>
    </>
  ) : isIconOnly ? (
    <span aria-hidden="true" className="inline-flex">
      {icon}
    </span>
  ) : (
    <>
      {leadingIcon}
      {/* Long text is truncated, never wrapped (FR-014) — button copy stays short by
          product convention; this is a safety net, not the expected case. min-w-0
          overrides the flex item default (min-width: auto), which would otherwise
          refuse to shrink below the text's intrinsic width and defeat truncate
          entirely whenever the button itself has a width constraint applied. */}
      <span className="truncate min-w-0 max-w-full">{children}</span>
      {trailingIcon}
    </>
  );

  // Anchors have no native `disabled` attribute, so inactivity is enforced explicitly:
  // removed from tab order and clicks/Enter-activation are suppressed (FR-007).
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isInactive) {
      event.preventDefault();
      return;
    }
    onClick?.(event as MouseEvent<HTMLButtonElement> & MouseEvent<HTMLAnchorElement>);
  };

  if (as === "a") {
    return (
      <a
        className={classes}
        aria-disabled={isInactive || undefined}
        aria-busy={loading || undefined}
        tabIndex={isInactive ? -1 : undefined}
        onClick={handleAnchorClick}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={isInactive}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export { buttonVariants };
