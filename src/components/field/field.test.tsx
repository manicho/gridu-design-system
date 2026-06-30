import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "./field";
import { Input } from "./input";

describe("Field — labeled, ready-to-fill text field (US1)", () => {
  it("associates the label with the input via htmlFor/id and applies the label typography role", () => {
    render(
      <Field label="Business name">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Business name");
    expect(input).toBeInTheDocument();
    const label = screen.getByText("Business name");
    expect(label.tagName).toBe("LABEL");
    expect(label.className).toContain("text-label");
  });

  it("every input type renders the documented tokens.css-traceable base classes", () => {
    (["text", "email", "password", "tel", "search", "number"] as const).forEach((type) => {
      render(
        <Field label={`Field ${type}`}>
          <Input type={type} />
        </Field>,
      );
      const input = screen.getByLabelText(`Field ${type}`);
      expect(input).toHaveAttribute("type", type);
      expect(input.className).toContain("border-input");
      expect(input.className).toContain("text-body-default");
    });
  });

  it("disabled removes the input from tab order and blocks typing", async () => {
    const user = userEvent.setup();
    render(
      <Field label="Disabled field">
        <Input disabled defaultValue="initial" />
      </Field>,
    );
    const input = screen.getByLabelText("Disabled field");
    expect(input).toBeDisabled();
    await user.tab();
    expect(input).not.toHaveFocus();
    await user.type(input, "more text");
    expect(input).toHaveValue("initial");
  });

  it("read-only keeps the input focusable/selectable but blocks value changes", async () => {
    const user = userEvent.setup();
    render(
      <Field label="Read-only field">
        <Input readOnly defaultValue="fixed-value" />
      </Field>,
    );
    const input = screen.getByLabelText("Read-only field");
    expect(input.className).toContain("bg-muted-surface");
    await user.click(input);
    expect(input).toHaveFocus();
    await user.keyboard("more text");
    expect(input).toHaveValue("fixed-value");
  });
});

describe("Field — validation error display (US2)", () => {
  it("sets aria-invalid and aria-describedby pointing at the error text when error is set", () => {
    render(
      <Field label="Phone number" error="Enter a valid phone number">
        <Input type="tel" />
      </Field>,
    );
    const input = screen.getByLabelText("Phone number");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorText = screen.getByText("Enter a valid phone number");
    expect(input.getAttribute("aria-describedby")).toBe(errorText.id);
    expect(errorText.className).toContain("text-destructive");
    expect(input.className).toContain("border-destructive");
  });

  it("renders only the error when both helperText and error are set", () => {
    render(
      <Field label="Phone number" helperText="We'll only use this to confirm your booking" error="Enter a valid phone number">
        <Input type="tel" />
      </Field>,
    );
    expect(screen.getByText("Enter a valid phone number")).toBeInTheDocument();
    expect(screen.queryByText("We'll only use this to confirm your booking")).not.toBeInTheDocument();
  });

  it("clears the error and destructive outline once the field is corrected", () => {
    const { rerender } = render(
      <Field label="Phone number" error="Enter a valid phone number">
        <Input type="tel" />
      </Field>,
    );
    expect(screen.getByText("Enter a valid phone number")).toBeInTheDocument();

    rerender(
      <Field label="Phone number">
        <Input type="tel" />
      </Field>,
    );
    expect(screen.queryByText("Enter a valid phone number")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Phone number")).not.toHaveAttribute("aria-invalid");
  });

  it("disabled suppresses error display and the destructive outline regardless of the error prop", () => {
    render(
      <Field label="Phone number" error="Enter a valid phone number">
        <Input type="tel" disabled />
      </Field>,
    );
    expect(screen.queryByText("Enter a valid phone number")).not.toBeInTheDocument();
    const input = screen.getByLabelText("Phone number");
    expect(input.className).not.toContain("border-destructive");
    expect(input).not.toHaveAttribute("aria-invalid");
  });
});

describe("Field — keyboard and screen-reader accessibility (US3)", () => {
  it("includes a focus-visible ring built on the --ring role", () => {
    render(
      <Field label="Business name">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Business name");
    expect(input.className).toContain("focus-visible:ring-ring");
  });

  it("is reachable via Tab and receives DOM focus", async () => {
    const user = userEvent.setup();
    render(
      <Field label="Business name">
        <Input />
      </Field>,
    );
    await user.tab();
    expect(screen.getByLabelText("Business name")).toHaveFocus();
  });

  it("required fields expose the native required attribute and a visual indicator on the label", () => {
    render(
      <Field label="Email" required>
        <Input type="email" />
      </Field>,
    );
    // jsdom's getByLabelText matches the label's full textContent, which includes the
    // visual "*" indicator even though it's aria-hidden — a real browser's accessible-name
    // computation excludes aria-hidden descendants, so `exact: false` mirrors that here.
    const input = screen.getByLabelText("Email", { exact: false });
    expect(input).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("exposes helper text via aria-describedby the same way an error is exposed", () => {
    render(
      <Field label="Phone number" helperText="We'll only use this to confirm your booking">
        <Input type="tel" />
      </Field>,
    );
    const input = screen.getByLabelText("Phone number");
    const helperText = screen.getByText("We'll only use this to confirm your booking");
    expect(input.getAttribute("aria-describedby")).toBe(helperText.id);
    // helper text alone (no error) must never mark the field invalid
    expect(input).not.toHaveAttribute("aria-invalid");
  });
});

describe("Field — helper text and icon adornments (US4)", () => {
  it("applies the caption typography role and a muted color to helper text when no error is active", () => {
    render(
      <Field label="Phone number" helperText="We'll only use this to confirm your booking">
        <Input type="tel" />
      </Field>,
    );
    const helperText = screen.getByText("We'll only use this to confirm your booking");
    expect(helperText.className).toContain("text-caption");
    expect(helperText.className).toContain("text-muted-foreground");
  });

  it("applies the leading-icon padding shift class when a leadingIcon is provided", () => {
    render(
      <Field label="Search">
        <Input type="search" leadingIcon={<span data-testid="leading-icon">S</span>} />
      </Field>,
    );
    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Search").className).toContain("pl-9");
  });

  it("applies the trailing-icon padding shift class when a trailingIcon is provided", () => {
    render(
      <Field label="Confirm deletion">
        <Input trailingIcon={<span data-testid="trailing-icon">X</span>} />
      </Field>,
    );
    expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm deletion").className).toContain("pr-9");
  });

  it("applies both padding shifts when leading and trailing icons are combined", () => {
    render(
      <Field label="Filter">
        <Input leadingIcon={<span>L</span>} trailingIcon={<span>T</span>} />
      </Field>,
    );
    const input = screen.getByLabelText("Filter");
    expect(input.className).toContain("pl-9");
    expect(input.className).toContain("pr-9");
  });
});
