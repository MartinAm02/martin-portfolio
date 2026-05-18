"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { chatContent, heroContent, suggestions } from "@/lib/data";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  mobile?: boolean;
};

export function ChatPanel({ mobile = false }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: chatContent.initialAssistantMessage }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiMessages = useMemo(
    () => messages.filter((message) => message.role === "user" || message.role === "assistant"),
    [messages]
  );

  async function sendMessage(content: string) {
    const trimmed = content.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...apiMessages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: nextMessages })
      });

      const payload = await response.json() as { text?: string; error?: string };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.ok
            ? payload.text ?? "No response."
            : payload.error ?? chatContent.genericErrorMessage
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: chatContent.genericErrorMessage }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <section className={mobile ? "hero mobile-spacer" : "hero"} id="chat">
      <div className="hero-ey">{heroContent.eyebrow}</div>
      <h1 className="hero-h">
        {heroContent.titlePrefix}<em>{heroContent.titleAccent}</em>
        {!mobile && <><br />{heroContent.titleSuffix}</>}
      </h1>
      <p className="hero-p">{heroContent.description}</p>

      <div className={mobile ? "mobile-sugs" : "sugs"}>
        {suggestions.map((suggestion, index) => (
          <button
            className={mobile ? "sug mobile-sug" : "sug"}
            disabled={isLoading}
            key={suggestion.text}
            onClick={() => void sendMessage(suggestion.text)}
            type="button"
          >
            {mobile && <div className="mobile-icon">{index + 1}</div>}
            <div>
              <div className="sug-l">{suggestion.label}</div>
              <div className="sug-t">{suggestion.text}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="chat-panel" aria-live="polite">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              {message.content}
            </div>
          ))}
          {isLoading && <div className="chat-message assistant">Thinking...</div>}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            disabled={isLoading}
            onChange={(event) => setInput(event.target.value)}
            placeholder={chatContent.inputPlaceholder}
            ref={inputRef}
            value={input}
          />
          <button className="chat-send" disabled={isLoading || input.trim().length === 0} type="submit">
            {chatContent.sendLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
