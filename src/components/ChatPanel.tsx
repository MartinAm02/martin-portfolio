"use client";

import { FormEvent, type RefObject, useMemo, useRef, useState } from "react";
import type { ChatContent, HeroContent, Suggestion } from "@/lib/data";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatWindowProps = {
  chatContent: ChatContent;
  contextPrompt?: string;
  initialMessage?: string;
  suggestions?: Suggestion[];
};

type ChatPanelProps = ChatWindowProps & {
  heroContent: HeroContent;
  mobile?: boolean;
  suggestions: Suggestion[];
};

type FloatingDemoChatProps = ChatWindowProps & {
  title: string;
};

function useChat({ chatContent, contextPrompt, initialMessage }: Omit<ChatWindowProps, "suggestions">) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: initialMessage ?? chatContent.initialAssistantMessage }
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
    const messagesForApi: ChatMessage[] = contextPrompt
      ? [{ role: "assistant", content: contextPrompt }, ...nextMessages]
      : nextMessages;

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messagesForApi })
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

  return {
    handleSubmit,
    input,
    inputRef,
    isLoading,
    messages,
    sendMessage,
    setInput
  };
}

function ChatWindow({
  chatContent,
  input,
  inputRef,
  isLoading,
  messages,
  onSubmit,
  sendMessage,
  setInput,
  suggestions = []
}: {
  chatContent: ChatContent;
  input: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  messages: ChatMessage[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  sendMessage: (content: string) => Promise<void>;
  setInput: (value: string) => void;
  suggestions?: Suggestion[];
}) {

  return (
    <div className="chat-panel" aria-live="polite">
      {suggestions.length > 0 && (
        <div className="chat-quick-actions">
          {suggestions.map((suggestion) => (
            <button disabled={isLoading} key={suggestion.text} onClick={() => void sendMessage(suggestion.text)} type="button">
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="chat-message assistant">{chatContent.thinkingMessage ?? "Thinking..."}</div>}
      </div>

        <form className="chat-form" onSubmit={onSubmit}>
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
  );
}

export function ChatPanel({ chatContent, contextPrompt, heroContent, initialMessage, mobile = false, suggestions }: ChatPanelProps) {
  const chat = useChat({ chatContent, contextPrompt, initialMessage });

  return (
    <section className={mobile ? "hero mobile-spacer" : "hero hero-chat-product"} id="chat">
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
            key={suggestion.text}
            type="button"
            disabled={chat.isLoading}
            onClick={() => void chat.sendMessage(suggestion.text)}
          >
            {mobile && <div className="mobile-icon">{index + 1}</div>}
            <div>
              <div className="sug-l">{suggestion.label}</div>
              <div className="sug-t">{suggestion.text}</div>
            </div>
          </button>
        ))}
      </div>

      <ChatWindow
        chatContent={chatContent}
        input={chat.input}
        inputRef={chat.inputRef}
        isLoading={chat.isLoading}
        messages={chat.messages}
        onSubmit={chat.handleSubmit}
        sendMessage={chat.sendMessage}
        setInput={chat.setInput}
      />
    </section>
  );
}

export function FloatingDemoChat({ chatContent, contextPrompt, initialMessage, suggestions, title }: FloatingDemoChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat({ chatContent, contextPrompt, initialMessage });

  return (
    <div className={`floating-chat ${isOpen ? "open" : ""}`}>
      <button className="floating-chat-toggle" onClick={() => setIsOpen((current) => !current)} type="button">
        {isOpen ? "×" : "AI"}
      </button>
      <div className="floating-chat-panel">
        <div className="floating-chat-head">
          <span>{title}</span>
          <button onClick={() => setIsOpen(false)} type="button">×</button>
        </div>
        <ChatWindow
          chatContent={chatContent}
          input={chat.input}
          inputRef={chat.inputRef}
          isLoading={chat.isLoading}
          messages={chat.messages}
          onSubmit={chat.handleSubmit}
          sendMessage={chat.sendMessage}
          setInput={chat.setInput}
          suggestions={suggestions}
        />
      </div>
    </div>
  );
}
