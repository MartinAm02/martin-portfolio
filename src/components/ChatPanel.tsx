"use client";

import { FormEvent, type RefObject, useMemo, useRef, useState } from "react";
import type { ChatContent, HeroContent, Suggestion } from "@/lib/data";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type StructuredCard = {
  type: "impact_card" | "metric_card" | "next_question";
  title: string;
  text: string;
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

function inferDemo(contextPrompt?: string) {
  if (!contextPrompt) {
    return "portfolio";
  }

  if (contextPrompt.includes("Iris Classifier")) {
    return "iris";
  }

  if (contextPrompt.includes("ABC Analysis")) {
    return "abc";
  }

  if (contextPrompt.includes("Sales Commission Pipeline")) {
    return "pipeline";
  }

  return "portfolio";
}

function inferLanguage(text: string, contextPrompt?: string) {
  const lower = text.toLowerCase();
  if (/[¿áéíóúñ]/i.test(text) || lower.includes("soy ") || lower.includes("por qué") || lower.includes("qué ")) {
    return "es";
  }

  if (contextPrompt?.includes("Idioma actual: español")) {
    return "es";
  }

  return "en";
}

function getStructuredCards(latestUserMessage: string | undefined, contextPrompt?: string): StructuredCard[] {
  if (!latestUserMessage) {
    return [];
  }

  const normalized = latestUserMessage.toLowerCase();
  const isRecruiterLike = [
    "soy reclutador",
    "no entiendo el impacto",
    "por qué importa",
    "que demuestra",
    "qué demuestra",
    "por qué debería contratarlo",
    "qué valor tiene",
    "as a recruiter",
    "why does this matter",
    "what does this show",
    "why hire"
  ].some((signal) => normalized.includes(signal));

  if (!isRecruiterLike) {
    return [];
  }

  const demo = inferDemo(contextPrompt);
  const lang = inferLanguage(latestUserMessage, contextPrompt);
  const es = lang === "es";

  const content = {
    iris: es
      ? [
          ["Qué demuestra", "Criterio para explicar modelos, incertidumbre y probabilidades sin vender el demo como producción."],
          ["Impacto en empresa", "El patrón ayuda a que negocio entienda cuándo confiar en una predicción y por qué."],
          ["Señal técnica", "Comunicación, interpretabilidad y pensamiento de producto aplicado a ML."]
        ]
      : [
          ["What it shows", "Judgment to explain models, uncertainty and probabilities without presenting the demo as production ML."],
          ["Business impact", "The pattern helps business users understand when to trust a prediction and why."],
          ["Technical signal", "Communication, interpretability and product thinking applied to ML."]
        ],
    abc: es
      ? [
          ["Qué demuestra", "Convierte análisis Pareto en recomendaciones de inventario y decisiones de compras."],
          ["Impacto en empresa", "Ayuda a priorizar control, abastecimiento, proveedores y capital inmovilizado."],
          ["Señal técnica", "Criterio aplicado, simulación what-if y traducción de datos a operación."]
        ]
      : [
          ["What it shows", "Turns Pareto analysis into inventory recommendations and procurement decisions."],
          ["Business impact", "Helps prioritize control, supply, suppliers and tied-up capital."],
          ["Technical signal", "Applied judgment, what-if simulation and translation from data to operations."]
        ],
    pipeline: es
      ? [
          ["Qué demuestra", "Construye datos confiables: ingesta, transformación, calidad, reportes y demo web."],
          ["Impacto en empresa", "Reduce errores y trabajo manual antes de tomar decisiones con datos."],
          ["Señal técnica", "Arquitectura medallion, validaciones, separación frontend/procesamiento y límites honestos."]
        ]
      : [
          ["What it shows", "Builds reliable data: ingestion, transformation, quality checks, reporting and a web demo."],
          ["Business impact", "Reduces errors and manual work before decisions are made from data."],
          ["Technical signal", "Medallion architecture, validation, frontend/processing separation and honest limits."]
        ],
    portfolio: es
      ? [
          ["Qué demuestra", "Perfil orientado a datos, automatización e IA aplicada con comunicación clara."],
          ["Impacto en empresa", "Puede conectar tecnología con decisiones accionables para equipos no técnicos."],
          ["Señal técnica", "Combina ingeniería de datos, analítica, ML y producto web."]
        ]
      : [
          ["What it shows", "A data, automation and applied AI profile with clear communication."],
          ["Business impact", "Can connect technology with actionable decisions for non-technical teams."],
          ["Technical signal", "Combines data engineering, analytics, ML and web product work."]
        ]
  }[demo];

  return content.map(([title, text]) => ({ title, text, type: "impact_card" }));
}

function ChatWindow({
  chatContent,
  contextPrompt,
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
  contextPrompt?: string;
  input: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  messages: ChatMessage[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  sendMessage: (content: string) => Promise<void>;
  setInput: (value: string) => void;
  suggestions?: Suggestion[];
}) {

  const [initialMessage, ...conversation] = messages;
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content;
  const structuredCards = getStructuredCards(latestUserMessage, contextPrompt);

  return (
    <div className="chat-panel" aria-live="polite">
      <div className="chat-messages">
        {initialMessage && (
          <div className={`chat-message ${initialMessage.role}`}>
            {initialMessage.content}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="chat-quick-actions">
            {suggestions.map((suggestion) => (
              <button disabled={isLoading} key={suggestion.text} onClick={() => void sendMessage(suggestion.text)} type="button">
                <span>{suggestion.label}</span>
                <strong>{suggestion.text}</strong>
              </button>
            ))}
          </div>
        )}

        {conversation.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            {message.content}
          </div>
        ))}
        {structuredCards.length > 0 && (
          <div className="chat-structured-cards" aria-label="Structured response cards">
            {structuredCards.map((card) => (
              <article className={`chat-structured-card ${card.type}`} key={card.title}>
                <span>{card.title}</span>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        )}
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

export function ChatPanel({
  chatContent,
  contextPrompt,
  heroContent,
  initialMessage,
  mobile = false,
  suggestions
}: ChatPanelProps) {
  const chat = useChat({ chatContent, contextPrompt, initialMessage });

  return (
    <section className={mobile ? "hero mobile-spacer" : "hero hero-chat-product"} id="chat">
      <div className="hero-ey">{heroContent.eyebrow}</div>
      <h1 className="hero-h">
        {heroContent.titlePrefix}<em>{heroContent.titleAccent}</em>
        {!mobile && <><br />{heroContent.titleSuffix}</>}
      </h1>
      <p className="hero-p">{heroContent.description}</p>

      <ChatWindow
        chatContent={chatContent}
        contextPrompt={contextPrompt}
        input={chat.input}
        inputRef={chat.inputRef}
        isLoading={chat.isLoading}
        messages={chat.messages}
        onSubmit={chat.handleSubmit}
        sendMessage={chat.sendMessage}
        setInput={chat.setInput}
        suggestions={suggestions}
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
          contextPrompt={contextPrompt}
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
