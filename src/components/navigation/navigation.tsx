import { cva } from "class-variance-authority";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type NavigationLayout = "vertical" | "horizontal";

type CommonNavItemProps = {
  label: string;
  leadingIcon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
};

export type AnchorNavItemProps = CommonNavItemProps & {
  as?: "a";
  href: string;
};

export type ButtonNavItemProps = CommonNavItemProps & {
  as: "button";
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type NavItemProps = AnchorNavItemProps | ButtonNavItemProps;

export type NavigationProps = {
  /** Rendered as aria-label — required (not optional) so multiple <nav> landmarks on one
   *  page stay distinguishable to screen reader users navigating by landmark
   *  (research.md Decision 6). */
  label: string;
  destinations: NavItemProps[];
  layout?: NavigationLayout;
  className?: string;
};

// Focus-ring convention shared with Button, Field, Card, and Table (Features 07-10) — same
// `ring` token, same focus-visible-only application.
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

// research.md Decision 2 — the active accent changes border *width* (1px -> 2px), not just
// color, so it reads as more than a color change alone (FR-003) — the same technique Card's
// `selected` state already uses. research.md Decision 3 — disabled uses `aria-disabled` +
// `tabIndex={-1}` + `pointer-events-none` uniformly for both `as` values (rather than native
// `disabled`, which has no effect on an `<a>`), so behavior is identical regardless of the
// underlying element.
const navItemVariants = cva(
  cn(
    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-label text-muted-foreground transition-colors hover:bg-muted-surface active:bg-muted-surface/80",
    FOCUS_RING,
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ),
  {
    variants: {
      layout: {
        vertical: "border-l border-transparent",
        horizontal: "border-b border-transparent",
      },
      active: {
        true: "text-foreground",
        false: "",
      },
    },
    compoundVariants: [
      { layout: "vertical", active: true, className: "border-l-2 border-foreground" },
      { layout: "horizontal", active: true, className: "border-b-2 border-foreground" },
    ],
    defaultVariants: {
      layout: "vertical",
      active: false,
    },
  },
);

function NavItem({ item, layout }: { item: NavItemProps; layout: NavigationLayout }) {
  const { label, leadingIcon, active = false, disabled = false, className } = item;
  const classes = cn(navItemVariants({ layout, active }), className);

  // FR-012 — truncate utility + native title fallback, the same pattern Table's text-cell
  // truncation uses (research.md Decision 5); min-w-0 lets the label actually shrink inside
  // the flex item instead of forcing the row to overflow.
  const content = (
    <>
      {leadingIcon && (
        <span aria-hidden="true" className="shrink-0">
          {leadingIcon}
        </span>
      )}
      <span className="min-w-0 max-w-full truncate">{label}</span>
    </>
  );

  if (item.as === "button") {
    // FR-011 — aria-disabled/tabIndex/pointer-events-none (in navItemVariants) already
    // suppress mouse activation; this guard additionally blocks a disabled item's onClick
    // from firing if it's ever activated via a synthetic or keyboard-dispatched event.
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      item.onClick(event);
    };

    return (
      <button
        type="button"
        className={classes}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        title={label}
        onClick={handleClick}
      >
        {content}
      </button>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) event.preventDefault();
  };

  return (
    <a
      href={item.href}
      className={classes}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      title={label}
      onClick={handleClick}
    >
      {content}
    </a>
  );
}

export function Navigation({ label, destinations, layout = "vertical", className }: NavigationProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "flex bg-background",
        layout === "vertical" ? "flex-col gap-1" : "flex-row gap-1",
        className,
      )}
    >
      {destinations.map((item, index) => (
        <NavItem key={index} item={item} layout={layout} />
      ))}
    </nav>
  );
}

export { navItemVariants };
