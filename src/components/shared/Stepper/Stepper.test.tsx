import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stepper } from "./Stepper";

describe("Stepper", () => {
  const steps = [
    { title: "Transfer Details", description: "Provide transfer name, file, and approver." },
    { title: "Review Records", description: "Check parsed transactions and validation results." },
    { title: "Summary", description: "Verify totals before confirming transfer." },
  ];

  it("renders configured steps with titles and descriptions", () => {
    render(<Stepper steps={steps} activeStep={1} ariaLabel="Batch transfer progress" />);

    const stepper = screen.getByRole("list", { name: "Batch transfer progress" });
    const items = within(stepper).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getByText("Transfer Details")).toBeInTheDocument();
    expect(screen.getByText("Review Records")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("marks prior, current, and upcoming steps using data-state", () => {
    render(<Stepper steps={steps} activeStep={2} ariaLabel="Batch transfer progress" />);

    const stepper = screen.getByRole("list", { name: "Batch transfer progress" });
    const items = within(stepper).getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-state", "completed");
    expect(items[1]).toHaveAttribute("data-state", "active");
    expect(items[2]).toHaveAttribute("data-state", "waiting");
  });
});
