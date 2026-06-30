import { cva } from "class-variance-authority";
import { useId, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export type CardVariant = "informational" | "interactive";
export type CardLayout = "vertical" | "horizontal";

// Surface/border/spacing all resolve to tokens.css/06-define-design-tokens roles (FR-002,
// FR-003, FR-011) — no shadow/elevation primitive is introduced (FR-002, spec
// Clarifications), since none is documented yet; depth comes from `border` + surface
// contrast only. `selected` increases border weight rather than relying on color alone
// (FR-007). Hover/pressed/focus only ever apply via the `interactive: true` branch, which is
// only used for the interactive variant's rendered `<a>`/`<button>`.
const cardVariants = cva("rounded-md border border-border bg-background p-4", {
  variants: {
    layout: {
      vertical: "flex flex-col gap-4",
      horizontal: "flex flex-row items-start gap-4",
    },
    interactive: {
      true: "cursor-pointer text-left transition-colors hover:bg-muted-surface active:bg-muted-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
      false: "",
    },
    selected: {
      true: "border-2 border-foreground",
      false: "",
    },
  },
  defaultVariants: {
    layout: "vertical",
    interactive: false,
    selected: false,
  },
});

export type CommonCardProps = {
  variant?: CardVariant;
  layout?: CardLayout;
  heading?: ReactNode;
  /** Leading media/icon region — only placed when layout="horizontal" (FR-014). */
  media?: ReactNode;
  footer?: ReactNode;
  /** 3-line clamp with ellipsis on the body only, for consumer-flagged fixed-height
   *  layouts (FR-015, research.md Decision 4). Does not affect heading/footer. */
  clampBody?: boolean;
  className?: string;
  children: ReactNode;
};

export type InformationalCardProps = CommonCardProps & {
  variant?: "informational";
};

// Shared by both interactive shapes — split further below so `href` is required at the
// type level only when as="a" (research.md Decision 6).
type InteractiveCommonProps = CommonCardProps & {
  variant: "interactive";
  selected?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Explicit accessible-name override (FR-008). When omitted, the accessible name
   *  resolves from `heading` via `aria-labelledby` (research.md Decision 6). */
  "aria-label"?: string;
};

export type InteractiveLinkCardProps = InteractiveCommonProps & {
  as: "a";
  href: string;
};

export type InteractiveButtonCardProps = InteractiveCommonProps & {
  as?: "button";
  href?: never;
};

export type InteractiveCardProps = InteractiveLinkCardProps | InteractiveButtonCardProps;

export type CardProps = InformationalCardProps | InteractiveCardProps;

// research.md Decision 5 — used by the bubble-phase click handler below to tell a nested
// interactive element (e.g. a Button in the footer) apart from the Card's own element.
const NESTED_INTERACTIVE_SELECTOR = "a, button, input, select, textarea, [role='button']";

export function Card(props: CardProps) {
  const headingId = useId();
  const { layout = "vertical", heading, media, footer, clampBody = false, className, children } = props;

  const regions = (
    <div className="flex min-w-0 flex-col gap-2">
      {heading && (
        <div id={headingId} className="text-heading-subsection font-medium text-foreground">
          {heading}
        </div>
      )}
      <div className={cn("text-body-default text-foreground", clampBody && "line-clamp-3")}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-border pt-3 text-body-secondary text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );

  // FR-014: media only renders (and only reserves space) in horizontal layout.
  const body =
    layout === "horizontal" && media ? (
      <>
        <span aria-hidden="true" className="shrink-0">
          {media}
        </span>
        {regions}
      </>
    ) : (
      regions
    );

  if (props.variant !== "interactive") {
    return <article className={cn(cardVariants({ layout }), className)}>{body}</article>;
  }

  const { selected = false, disabled = false, onClick } = props;
  const ariaLabel = props["aria-label"];
  const labelProps = ariaLabel
    ? { "aria-label": ariaLabel }
    : heading
      ? { "aria-labelledby": headingId }
      : {};
  const classes = cn(cardVariants({ layout, interactive: true, selected }), className);

  // T014: one bubble-phase handler covers both disabled-suppression and nested-element
  // detection (research.md Decision 5). It never intercepts a nested element's own handler
  // — that one already ran during the bubble phase before this one — it only suppresses the
  // Card's *own* action (anchor navigation / onClick) for that click, satisfying both halves
  // of FR-013 ("not intercepted" and "not duplicated").
  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    const target = event.target as HTMLElement;
    const nearestInteractive = target.closest(NESTED_INTERACTIVE_SELECTOR);
    if (nearestInteractive !== null && nearestInteractive !== event.currentTarget) {
      if (props.as === "a") event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  if (props.as === "a") {
    return (
      <a
        href={props.href}
        className={classes}
        aria-disabled={disabled || undefined}
        aria-current={selected ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleClick}
        {...labelProps}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-pressed={selected ? "true" : undefined}
      onClick={handleClick}
      {...labelProps}
    >
      {body}
    </button>
  );
}

export { cardVariants };
