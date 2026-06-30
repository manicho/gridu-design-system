import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navigation } from "./navigation";

describe("Navigation — vertical sidebar, active state (US1)", () => {
  it("renders as a <nav> landmark with the supplied aria-label and tokens.css-traceable classes", () => {
    render(<Navigation label="Dashboard" destinations={[{ label: "Bookings", href: "#bookings" }]} />);
    const nav = screen.getByRole("navigation", { name: "Dashboard" });
    expect(nav.className).toContain("bg-background");
    const link = screen.getByRole("link", { name: "Bookings" });
    expect(link.className).toContain("text-label");
    expect(link.className).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it("marks exactly the active destination with aria-current='page' and no others", () => {
    render(
      <Navigation
        label="Dashboard"
        destinations={[
          { label: "Bookings", href: "#bookings", active: true },
          { label: "Clients", href: "#clients" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Bookings" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Clients" })).not.toHaveAttribute("aria-current");
  });

  it("renders no aria-current on any destination when none is marked active (FR-004 negative path)", () => {
    render(
      <Navigation
        label="Dashboard"
        destinations={[
          { label: "Bookings", href: "#bookings" },
          { label: "Clients", href: "#clients" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Bookings" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Clients" })).not.toHaveAttribute("aria-current");
  });

  it("applies the border-weight active accent (width change, not color alone)", () => {
    render(<Navigation label="Dashboard" destinations={[{ label: "Bookings", href: "#bookings", active: true }]} />);
    const link = screen.getByRole("link", { name: "Bookings" });
    expect(link.className).toContain("border-l-2");
    expect(link.className).toContain("border-foreground");
  });

  it("applies the focus-visible ring convention shared with Button/Card/Table", () => {
    render(<Navigation label="Dashboard" destinations={[{ label: "Bookings", href: "#bookings" }]} />);
    const link = screen.getByRole("link", { name: "Bookings" });
    expect(link.className).toContain("focus-visible:ring-ring");
  });

  it("Enter activates a focused as='button' destination, matching pointer click (SC-003 keyboard coverage)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Navigation label="Dashboard" destinations={[{ label: "Log out", as: "button", onClick }]} />);
    screen.getByRole("button", { name: "Log out" }).focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Navigation — disabled destination (US2)", () => {
  it("Tab skips a disabled destination", async () => {
    const user = userEvent.setup();
    render(
      <Navigation
        label="Dashboard"
        destinations={[
          { label: "One", href: "#one" },
          { label: "Two", href: "#two", disabled: true },
          { label: "Three", href: "#three" },
        ]}
      />,
    );
    await user.tab();
    expect(screen.getByRole("link", { name: "One" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Three" })).toHaveFocus();
  });

  it("a disabled anchor announces aria-disabled, is removed from tab order, and carries the pointer-events block", () => {
    render(<Navigation label="Dashboard" destinations={[{ label: "Reports", href: "#reports", disabled: true }]} />);
    const link = screen.getByRole("link", { name: "Reports", hidden: true });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    // Tailwind's aria-disabled:pointer-events-none utility is applied as a literal class —
    // verifying its presence confirms the CSS-level mouse-click block is in place; the
    // JS-level preventDefault guard in handleClick covers keyboard-dispatched activations.
    expect(link.className).toContain("aria-disabled:pointer-events-none");
  });

  it("a disabled as='button' destination announces aria-disabled and never calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Navigation
        label="Dashboard"
        destinations={[{ label: "Log out", as: "button", onClick, disabled: true }]}
      />,
    );
    const button = screen.getByRole("button", { name: "Log out", hidden: true });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("tabindex", "-1");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Navigation — horizontal layout (US3)", () => {
  it("renders flex-row instead of flex-col and uses a bottom border for the active accent", () => {
    render(
      <Navigation
        label="Dashboard"
        layout="horizontal"
        destinations={[{ label: "Bookings", href: "#bookings", active: true }]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Dashboard" });
    expect(nav.className).toContain("flex-row");
    expect(nav.className).not.toContain("flex-col");
    const link = screen.getByRole("link", { name: "Bookings" });
    expect(link.className).toContain("border-b-2");
    expect(link.className).toContain("border-foreground");
  });

  it("active and disabled states behave identically to the vertical layout", () => {
    render(
      <Navigation
        label="Dashboard"
        layout="horizontal"
        destinations={[
          { label: "Bookings", href: "#bookings", active: true },
          { label: "Reports", href: "#reports", disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Bookings" })).toHaveAttribute("aria-current", "page");
    const disabledLink = screen.getByRole("link", { name: "Reports", hidden: true });
    expect(disabledLink).toHaveAttribute("aria-disabled", "true");
    expect(disabledLink).toHaveAttribute("tabindex", "-1");
  });
});

describe("Navigation — edge cases (truncation, empty list, missing icon)", () => {
  it("truncates an overflowing label with a title attribute carrying the full text", () => {
    const longLabel = "A very long destination label that should truncate visually";
    render(<Navigation label="Dashboard" destinations={[{ label: longLabel, href: "#long" }]} />);
    const link = screen.getByRole("link", { name: longLabel });
    expect(link).toHaveAttribute("title", longLabel);
    expect(within(link).getByText(longLabel).className).toContain("truncate");
  });

  it("renders the nav landmark with no items when destinations is empty", () => {
    render(<Navigation label="Empty demo" destinations={[]} />);
    const nav = screen.getByRole("navigation", { name: "Empty demo" });
    expect(nav.children).toHaveLength(0);
  });

  it("still renders and activates the label when leadingIcon is absent", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Navigation
        label="Dashboard"
        destinations={[{ label: "Log out", as: "button", onClick, leadingIcon: null }]}
      />,
    );
    const button = screen.getByRole("button", { name: "Log out" });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
