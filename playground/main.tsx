import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Card, Field, Input, type ButtonSize, type ButtonVariant } from "../src";
import "./playground.css";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "destructive", "outline", "ghost"];
const SIZES: ButtonSize[] = ["sm", "default", "lg"];

// Inline SVG placeholders — the playground has no icon library dependency
// (research.md Decision 3), matching gridu-landing's current setup.
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
      }}
      style={{ marginBottom: "1rem" }}
    >
      {dark ? "Switch to light" : "Switch to dark"}
    </button>
  );
}

function VariantSizeGrid() {
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th></th>
          {SIZES.map((size) => (
            <th key={size} style={{ padding: "0.5rem", textAlign: "left" }}>
              {size}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {VARIANTS.map((variant) => (
          <tr key={variant}>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>{variant}</th>
            {SIZES.map((size) => (
              <td key={size} style={{ padding: "0.5rem" }}>
                <Button variant={variant} size={size}>
                  {variant}
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StateInspector() {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <section>
      <h2>States: disabled vs loading</h2>
      <label style={{ marginRight: "1rem" }}>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />{" "}
        disabled
      </label>
      <label>
        <input
          type="checkbox"
          checked={loading}
          onChange={(event) => setLoading(event.target.checked)}
        />{" "}
        loading
      </label>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} disabled={disabled} loading={loading}>
            {variant}
          </Button>
        ))}
      </div>
    </section>
  );
}

function IconExamples() {
  return (
    <section>
      <h2>Icons</h2>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button leadingIcon={<PlusIcon />}>New booking</Button>
        <Button trailingIcon={<ArrowRightIcon />} variant="outline">
          View pricing
        </Button>
        {SIZES.map((size) => (
          <Button key={size} size={size} variant="ghost" icon={<CloseIcon />} aria-label="Close" />
        ))}
      </div>
    </section>
  );
}

function TruncationExample() {
  return (
    <section>
      <h2>Long text truncation (FR-014)</h2>
      <div style={{ width: "180px", border: "1px dashed gray", padding: "0.5rem" }}>
        {/* The button needs its own width constraint — inline-flex alone won't
            shrink below unwrappable text content, even inside a narrower parent. */}
        <Button className="max-w-full">
          This is a deliberately long button label that should truncate
        </Button>
      </div>
    </section>
  );
}

function FieldStatesGrid() {
  return (
    <section>
      <h2>Field: rest / hover / focus / disabled / read-only</h2>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <Field label="Business name">
          <Input placeholder="Hover me" />
        </Field>
        <Field label="Email" required>
          <Input type="email" placeholder="you@example.com" />
        </Field>
        <Field label="Disabled field">
          <Input disabled defaultValue="Can't touch this" />
        </Field>
        <Field label="Read-only field" helperText="Set automatically, not editable">
          <Input readOnly defaultValue="auto-generated-id-123" />
        </Field>
      </div>
    </section>
  );
}

function FieldErrorInspector() {
  const [hasError, setHasError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <section>
      <h2>Field: error + helper-text precedence</h2>
      <label style={{ marginRight: "1rem" }}>
        <input
          type="checkbox"
          checked={hasError}
          onChange={(event) => setHasError(event.target.checked)}
        />{" "}
        error
      </label>
      <label>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />{" "}
        disabled
      </label>
      <div style={{ marginTop: "1rem", maxWidth: "320px" }}>
        <Field
          label="Phone number"
          helperText="We'll only use this to confirm your booking"
          error={hasError ? "Enter a valid phone number" : undefined}
        >
          <Input type="tel" disabled={disabled} placeholder="+1 555 0100" />
        </Field>
      </div>
    </section>
  );
}

function FieldIconExamples() {
  return (
    <section>
      <h2>Field: icon adornments</h2>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <Field label="Search">
          <Input type="search" leadingIcon={<SearchIcon />} placeholder="Search bookings" />
        </Field>
        <Field label="Confirm deletion">
          <Input trailingIcon={<CloseIcon />} placeholder="Type DELETE" />
        </Field>
        <Field label="Both icons">
          <Input leadingIcon={<SearchIcon />} trailingIcon={<CloseIcon />} placeholder="Filter" />
        </Field>
      </div>
    </section>
  );
}

function CardRegionGrid() {
  return (
    <section>
      <h2>Card: layout × region composition</h2>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", maxWidth: "900px" }}>
        <div style={{ width: "260px" }}>
          <Card heading="Booking summary" footer="3 appointments today">
            Vertical layout, heading + body + footer.
          </Card>
        </div>
        <div style={{ width: "260px" }}>
          <Card heading="No footer">Vertical layout, heading + body only — no reserved footer space.</Card>
        </div>
        <div style={{ width: "260px" }}>
          <Card>No heading, no footer — body only, no reserved space for either.</Card>
        </div>
        <div style={{ width: "320px" }}>
          <Card
            layout="horizontal"
            heading="Acme Bookings"
            footer="Updated 2 hours ago"
            media={
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "48px",
                  height: "48px",
                  borderRadius: "9999px",
                  background: "var(--muted-surface)",
                }}
              />
            }
          >
            Horizontal layout — media beside heading/body/footer.
          </Card>
        </div>
      </div>
    </section>
  );
}

function CardClampExample() {
  return (
    <section>
      <h2>Card: clampBody (FR-015)</h2>
      <div style={{ width: "220px", height: "160px" }}>
        <Card heading="Long body text" clampBody>
          This body text is deliberately long enough to overflow three lines, so the
          clampBody prop should truncate it to exactly three lines with a visible ellipsis
          rather than silently clipping it or growing the card past its fixed-height
          container.
        </Card>
      </div>
    </section>
  );
}

function CardInteractiveGrid() {
  const [selected, setSelected] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <section>
      <h2>Card: interactive states (US2)</h2>
      <label style={{ marginRight: "1rem" }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => setSelected(event.target.checked)}
        />{" "}
        selected
      </label>
      <label>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />{" "}
        disabled
      </label>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
        <div style={{ width: "240px" }}>
          <Card
            variant="interactive"
            as="button"
            heading="Plan card (button)"
            selected={selected}
            disabled={disabled}
            onClick={() => console.log("plan card clicked")}
          >
            Tab to it, hover it, click/Enter-activate it.
          </Card>
        </div>
        <div style={{ width: "240px" }}>
          <Card
            variant="interactive"
            as="a"
            href="#business-profile"
            heading="Business profile (link)"
            selected={selected}
            disabled={disabled}
          >
            Renders as a native anchor — navigates on activation.
          </Card>
        </div>
        <div style={{ width: "240px" }}>
          <Card
            variant="interactive"
            as="a"
            href="#nested-example"
            heading="Nested interactive element"
            onClick={() => console.log("card navigated")}
            footer={
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  console.log("nested button clicked");
                }}
              >
                Nested button
              </Button>
            }
          >
            Clicking the footer button must not also navigate the card.
          </Card>
        </div>
      </div>
    </section>
  );
}

function Playground() {
  return (
    <main
      style={{
        padding: "2rem",
        background: "var(--background)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <h1>gridu-design-system playground</h1>
      <DarkModeToggle />
      <h2>Variants × Sizes</h2>
      <VariantSizeGrid />
      <StateInspector />
      <IconExamples />
      <TruncationExample />
      <FieldStatesGrid />
      <FieldErrorInspector />
      <FieldIconExamples />
      <CardRegionGrid />
      <CardClampExample />
      <CardInteractiveGrid />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
