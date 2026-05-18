import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/data";

type ChatRole = "user" | "assistant";

type ClientMessage = {
  role: ChatRole;
  content: string;
};

type RateLimitEntry = {
  count: number;
  reset: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();
const windowMs = 60 * 60 * 1000;
const maxRequests = 30;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

function isClientMessage(value: unknown): value is ClientMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "placeholder") {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Add it to .env.local and restart the server." },
      { status: 500 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawMessages = typeof body === "object" && body !== null && "messages" in body
    ? (body as { messages: unknown }).messages
    : null;

  if (!Array.isArray(rawMessages)) {
    return NextResponse.json({ error: "Expected a messages array." }, { status: 400 });
  }

  const messages = rawMessages.filter(isClientMessage).slice(-20);

  if (messages.length === 0) {
    return NextResponse.json({ error: "At least one valid message is required." }, { status: 400 });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ]
    });

    const text = completion.choices[0]?.message?.content ?? "No response.";
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Groq error.";
    return NextResponse.json(
      { error: `Groq request failed: ${message}` },
      { status: 502 }
    );
  }
}
