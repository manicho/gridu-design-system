import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import { FieldLabel } from "./field-label";
import { FieldMessage, type FieldMessageTone } from "./field-message";
import type { InputProps } from "./input";
import { cn } from "../../lib/utils";

export type FieldProps = {
  label: string;
  required?: boolean;
  helperText?: string | undefined;
  error?: string | undefined;
  className?: string;
  children: ReactElement<InputProps>;
};

type Message = { tone: FieldMessageTone; text: string };

// Error/helper precedence and disabled-suppresses-error (research.md Decision 4):
// disabled hides any message entirely; otherwise error always wins over helperText.
function resolveMessage(disabled: boolean, error?: string, helperText?: string): Message | null {
  if (disabled) return null;
  if (error) return { tone: "error", text: error };
  if (helperText) return { tone: "helper", text: helperText };
  return null;
}

export function Field({ label, required = false, helperText, error, className, children }: FieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const messageId = `${id}-message`;

  const disabled = Boolean(children.props.disabled);
  const message = resolveMessage(disabled, error, helperText);

  // aria-invalid fires only for an actual error, never plain helper text — aria-describedby
  // fires for either, since both should be announced as associated with the field
  // (research.md Decision 3; User Story 3 Acceptance Scenario 3 extends the same
  // association to helper text, not just error text).
  const isError = message?.tone === "error";
  const describedBy = message ? messageId : undefined;

  const inputElement = isValidElement(children)
    ? cloneElement(children, {
        id: inputId,
        required,
        invalid: isError,
        "aria-invalid": isError || undefined,
        "aria-describedby": describedBy,
      } as Partial<InputProps>)
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel htmlFor={inputId} required={required}>
        {label}
      </FieldLabel>
      {inputElement}
      {message && (
        <FieldMessage id={messageId} tone={message.tone}>
          {message.text}
        </FieldMessage>
      )}
    </div>
  );
}
