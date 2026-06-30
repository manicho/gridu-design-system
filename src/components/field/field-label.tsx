import type { ReactNode } from "react";

export type FieldLabelProps = {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
};

// tokens.css's @layer base already styles bare <label> elements with the `label` role's
// size/line-height/weight, but the class is applied explicitly too so the role is visible
// in the rendered className for traceability and testing (FR-002, FR-012, User Story 1
// Acceptance Scenario 1).
export function FieldLabel({ htmlFor, required = false, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-label font-medium text-foreground">
      {children}
      {required && (
        // aria-hidden: the programmatic "required" announcement comes from the input's
        // own native `required` attribute (set by Field), not this visual asterisk
        // (FR-006).
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </label>
  );
}
