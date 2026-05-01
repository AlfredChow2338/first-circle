import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MessageProvider, useMessage } from "./MessageProvider";

function MessageHarness() {
  const message = useMessage();
  return (
    <div>
      <button onClick={() => message.success("Saved", 100)}>Success</button>
      <button onClick={() => message.error("Failed", 100)}>Error</button>
      <button
        onClick={() => {
          message.success("First", 100);
          message.error("Second", 100);
        }}
      >
        Sequence
      </button>
    </div>
  );
}

describe("MessageProvider", () => {
  it("renders success and error variants", () => {
    render(
      <MessageProvider>
        <MessageHarness />
      </MessageProvider>,
    );

    fireEvent.click(screen.getByText("Success"));
    fireEvent.click(screen.getByText("Error"));

    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("auto-dismisses messages by duration", () => {
    vi.useFakeTimers();

    render(
      <MessageProvider>
        <MessageHarness />
      </MessageProvider>,
    );

    fireEvent.click(screen.getByText("Success"));
    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("supports sequential messages", () => {
    render(
      <MessageProvider>
        <MessageHarness />
      </MessageProvider>,
    );

    fireEvent.click(screen.getByText("Sequence"));
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
