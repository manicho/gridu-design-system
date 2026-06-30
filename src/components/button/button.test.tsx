import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button — variants and sizes (US1)", () => {
  it("renders the primary variant by default with tokens.css-traceable classes", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.className).toContain("bg-brand");
    expect(button.className).toContain("text-primary-foreground");
  });

  it.each([
    ["primary", "bg-brand"],
    ["secondary", "bg-muted-surface"],
    ["destructive", "bg-destructive"],
    ["outline", "border-input"],
    ["ghost", "hover:bg-muted-surface"],
  ] as const)("renders the %s variant with its documented role classes", (variant, expectedClass) => {
    render(<Button variant={variant}>Action</Button>);
    const button = screen.getByRole("button", { name: "Action" });
    expect(button.className).toContain(expectedClass);
  });

  it("every variant includes an active: (pressed) class", () => {
    (["primary", "secondary", "destructive", "outline", "ghost"] as const).forEach(
      (variant) => {
        render(<Button variant={variant}>Action {variant}</Button>);
        const button = screen.getByRole("button", { name: `Action ${variant}` });
        expect(button.className).toMatch(/active:/);
      },
    );
  });

  it("applies the default size when omitted", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.className).toContain("h-10");
  });

  it.each([
    ["sm", "h-9"],
    ["default", "h-10"],
    ["lg", "h-11"],
  ] as const)("applies the %s size's height class", (size, expectedClass) => {
    render(<Button size={size}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.className).toContain(expectedClass);
  });

  it("truncates long text content instead of wrapping it (FR-014)", () => {
    render(<Button>A very long label that should never wrap onto a second line</Button>);
    const textSpan = screen.getByText(
      "A very long label that should never wrap onto a second line",
    );
    expect(textSpan.className).toContain("truncate");
    // min-w-0 overrides the flex-item default (min-width: auto), which would
    // otherwise prevent the span from ever shrinking below its content's
    // intrinsic width — without it, `truncate` silently never engages whenever
    // the button itself has a width constraint (caught via real-browser
    // verification, not jsdom — see quickstart.md).
    expect(textSpan.className).toContain("min-w-0");
  });
});

describe("Button — keyboard and screen-reader operability (US2)", () => {
  it("includes a focus-visible ring built on the --ring role (FR-006)", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.className).toContain("focus-visible:ring-ring");
    // Real :focus-visible (keyboard) vs :focus (mouse) matching is a browser CSS engine
    // concern jsdom doesn't reliably emulate — verified manually via quickstart.md
    // (Polish phase), not asserted here as a className diff.
  });

  it("is reachable via Tab and receives DOM focus", async () => {
    const user = userEvent.setup();
    render(<Button>Save</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it("disabled buttons block clicks and are removed from tab order (FR-007)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    await user.tab();
    expect(button).not.toHaveFocus();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading buttons set aria-busy, block clicks, and stay distinguishable from disabled (FR-008)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const loadingButton = screen.getByRole("button");
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    expect(loadingButton).toBeDisabled();
    await user.click(loadingButton);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText("Loading")).toHaveClass("sr-only");
    expect(screen.queryByText("Save")).not.toBeInTheDocument();

    rerender(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    // Loading's content (spinner + sr-only status) differs from disabled's (plain
    // unmodified children) — the visual/structural distinction the Edge Case ruling
    // requires (FR-008).
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});

describe("Button — icon support (US3)", () => {
  it("exposes the supplied aria-label as the accessible name for an icon-only button (FR-010)", () => {
    render(<Button icon={<svg aria-hidden="true" />} aria-label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("rejects an icon-only button missing aria-label at compile time (FR-010)", () => {
    // @ts-expect-error — icon-only mode requires `aria-label`; this fixture intentionally
    // omits it to prove the discriminated union enforces it at the type level, not just
    // at runtime or via lint.
    const missingAriaLabel = <Button icon={<svg aria-hidden="true" />} />;
    expect(missingAriaLabel).toBeDefined();
  });

  it("renders a leading icon before the text and a trailing icon after it", () => {
    render(
      <Button leadingIcon={<span data-testid="leading">L</span>} trailingIcon={<span data-testid="trailing">T</span>}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: /Save/ });
    const children = Array.from(button.children).map((el) => el.getAttribute("data-testid") ?? el.tagName);
    expect(screen.getByTestId("leading")).toBeInTheDocument();
    expect(screen.getByTestId("trailing")).toBeInTheDocument();
    // leading comes before the text span, trailing comes after
    expect(children[0]).toBe("leading");
    expect(children[children.length - 1]).toBe("trailing");
  });

  it("icon-only buttons stay square (equal width/height) at every size", () => {
    (["sm", "default", "lg"] as const).forEach((size) => {
      render(<Button size={size} icon={<svg aria-hidden="true" />} aria-label={`Close ${size}`} />);
      const button = screen.getByRole("button", { name: `Close ${size}` });
      expect(button.className).toContain("aspect-square");
      expect(button.className).toContain("p-0");
    });
  });
});
