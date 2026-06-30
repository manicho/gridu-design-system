import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export type FieldMessageTone = "helper" | "error";

export type FieldMessageProps = {
  id: string;
  tone: FieldMessageTone;
  children: ReactNode;
};

// Both tones share the `caption` typography role (typography-system.md); only the color
// differs — error escalates to `destructive`, helper stays `muted-foreground` (FR-004,
// FR-005, FR-012, research.md Decision 4).
export function FieldMessage({ id, tone, children }: FieldMessageProps) {
  return (
    <p
      id={id}
      className={cn(
        "text-caption tracking-caption",
        tone === "error" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {children}
    </p>
  );
}
