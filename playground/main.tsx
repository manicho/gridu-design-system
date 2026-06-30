import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, type ButtonSize, type ButtonVariant } from "../src";
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
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
