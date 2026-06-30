import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "./card";

describe("Card — grouped content at rest (US1)", () => {
  it("renders the surface/border tokens and no shadow utility", () => {
    render(<Card heading="Booking summary">Body content</Card>);
    const card = screen.getByText("Body content").closest("article")!;
    expect(card.className).toContain("bg-background");
    expect(card.className).toContain("border-border");
    expect(card.className).not.toMatch(/shadow/);
  });

  it("applies the heading-subsection, body-default, and body-secondary typography roles", () => {
    render(
      <Card heading="Booking summary" footer="3 appointments today">
        Body content
      </Card>,
    );
    expect(screen.getByText("Booking summary").className).toContain("text-heading-subsection");
    expect(screen.getByText("Body content").className).toContain("text-body-default");
    expect(screen.getByText("3 appointments today").className).toContain("text-body-secondary");
  });

  it("renders the footer with a border-t divider only when a footer is provided", () => {
    const { rerender } = render(<Card footer="Footer text">Body</Card>);
    expect(screen.getByText("Footer text").className).toContain("border-t");

    rerender(<Card>Body</Card>);
    expect(screen.queryByText("Footer text")).not.toBeInTheDocument();
  });

  it("omits heading and footer without rendering empty placeholder elements", () => {
    render(<Card>Body only</Card>);
    expect(screen.queryByText(/heading/i)).not.toBeInTheDocument();
    const card = screen.getByText("Body only").closest("article")!;
    // Only the body wrapper div should be present inside the card.
    expect(card.children).toHaveLength(1);
  });

  it("only renders media in the horizontal layout", () => {
    const { rerender } = render(
      <Card layout="horizontal" media={<span data-testid="media">M</span>}>
        Body
      </Card>,
    );
    expect(screen.getByTestId("media")).toBeInTheDocument();

    rerender(
      <Card layout="vertical" media={<span data-testid="media">M</span>}>
        Body
      </Card>,
    );
    expect(screen.queryByTestId("media")).not.toBeInTheDocument();
  });

  it("applies a 3-line clamp to the body only when clampBody is set", () => {
    render(
      <Card heading="Heading" footer="Footer" clampBody>
        Long body text
      </Card>,
    );
    expect(screen.getByText("Long body text").className).toContain("line-clamp-3");
    expect(screen.getByText("Heading").className).not.toContain("line-clamp-3");
    expect(screen.getByText("Footer").className).not.toContain("line-clamp-3");
  });
});

describe("Card — interactive states (US2)", () => {
  it("renders the element named by `as`", () => {
    const { rerender } = render(
      <Card variant="interactive" as="button">
        Body
      </Card>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <Card variant="interactive" as="a" href="#target">
        Body
      </Card>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "#target");
  });

  it("includes a focus-visible ring built on the --ring role", () => {
    render(
      <Card variant="interactive" as="button">
        Body
      </Card>,
    );
    expect(screen.getByRole("button").className).toContain("focus-visible:ring-ring");
  });

  it("is reachable via Tab and receives DOM focus", async () => {
    const user = userEvent.setup();
    render(
      <Card variant="interactive" as="button">
        Body
      </Card>,
    );
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("disabled blocks Tab focus and click for both as values", async () => {
    const user = userEvent.setup();
    const onClickButton = vi.fn();
    const { rerender } = render(
      <Card variant="interactive" as="button" disabled onClick={onClickButton}>
        Body
      </Card>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.tab();
    expect(button).not.toHaveFocus();

    const onClickLink = vi.fn();
    rerender(
      <Card variant="interactive" as="a" href="#target" disabled onClick={onClickLink}>
        Body
      </Card>,
    );
    const link = screen.getByRole("link", { hidden: true });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    await user.click(link);
    expect(onClickLink).not.toHaveBeenCalled();
  });

  it("sets aria-pressed for as=button and aria-current for as=a when selected, and applies the border-weight class", () => {
    const { rerender } = render(
      <Card variant="interactive" as="button" selected>
        Body
      </Card>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toContain("border-2");

    rerender(
      <Card variant="interactive" as="a" href="#target" selected>
        Body
      </Card>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-current", "true");
    expect(link.className).toContain("border-2");
  });

  it("a nested interactive element stays clickable and the Card's own onClick/navigation does not also fire", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    const onNestedClick = vi.fn();
    render(
      <Card
        variant="interactive"
        as="a"
        href="#target"
        onClick={onCardClick}
        footer={
          <button type="button" onClick={onNestedClick}>
            Nested
          </button>
        }
      >
        Body
      </Card>,
    );
    await user.click(screen.getByRole("button", { name: "Nested" }));
    expect(onNestedClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it("clicking the Card's own surface (not a nested element) fires onClick", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    render(
      <Card variant="interactive" as="button" onClick={onCardClick}>
        Body content
      </Card>,
    );
    await user.click(screen.getByText("Body content"));
    expect(onCardClick).toHaveBeenCalledTimes(1);
  });
});

describe("Card — accessible name, role, and selected state (US3)", () => {
  it("resolves the accessible name from heading when no explicit aria-label is passed", () => {
    render(
      <Card variant="interactive" as="button" heading="Plan card">
        Body
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Plan card" })).toBeInTheDocument();
  });

  it("an explicit aria-label overrides the heading-derived name", () => {
    render(
      <Card variant="interactive" as="button" heading="Plan card" aria-label="Choose the Pro plan">
        Body
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Choose the Pro plan" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Plan card" })).not.toBeInTheDocument();
  });

  it("exposes the correct implicit role for as=a and as=button", () => {
    const { rerender } = render(
      <Card variant="interactive" as="button">
        Body
      </Card>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <Card variant="interactive" as="a" href="#target">
        Body
      </Card>,
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("a selected card's aria-pressed/aria-current attribute is queryable in the accessibility tree", () => {
    render(
      <Card variant="interactive" as="button" heading="Plan card" selected>
        Body
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Plan card", pressed: true })).toBeInTheDocument();
  });
});
