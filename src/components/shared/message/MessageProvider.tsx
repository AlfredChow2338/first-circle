import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import * as messageStyles from "src/styles/message.css";

import type { ReactNode } from "react";

type MessageType = "success" | "error";

type MessageOptions = {
  type?: MessageType;
  durationMs?: number;
};

type MessageApi = {
  open: (content: string, options?: MessageOptions) => void;
  success: (content: string, durationMs?: number) => void;
  error: (content: string, durationMs?: number) => void;
};

type InternalMessage = {
  id: number;
  content: string;
  type: MessageType;
};

const DEFAULT_DURATION_MS = 2400;
const MAX_VISIBLE_MESSAGES = 3;

const MessageContext = createContext<MessageApi | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const nextIdRef = useRef(1);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeMessage = (id: number) => {
    const timeoutId = timersRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timersRef.current.delete(id);
    }
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const api = useMemo<MessageApi>(() => {
    const open: MessageApi["open"] = (content, options) => {
      const id = nextIdRef.current++;
      const durationMs = options?.durationMs ?? DEFAULT_DURATION_MS;
      const type = options?.type ?? "success";

      setMessages((prev) => {
        const next = [...prev, { id, content, type }];
        if (next.length > MAX_VISIBLE_MESSAGES) {
          return next.slice(next.length - MAX_VISIBLE_MESSAGES);
        }
        return next;
      });

      const timeoutId = setTimeout(() => {
        removeMessage(id);
      }, durationMs);
      timersRef.current.set(id, timeoutId);
    };

    return {
      open,
      success: (content, durationMs) => {
        open(content, { type: "success", durationMs });
      },
      error: (content, durationMs) => {
        open(content, { type: "error", durationMs });
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const timeoutId of timersRef.current.values()) {
        clearTimeout(timeoutId);
      }
      timersRef.current.clear();
    };
  }, []);

  return (
    <MessageContext.Provider value={api}>
      {children}
      <div className={messageStyles.messageViewport} aria-live="polite" aria-atomic="true">
        {messages.map((message) => (
          <div
            key={message.id}
            role="status"
            className={message.type === "success" ? messageStyles.messageSuccess : messageStyles.messageError}
          >
            {message.content}
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  );
}

export function useMessage(): MessageApi {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within MessageProvider");
  }
  return context;
}
