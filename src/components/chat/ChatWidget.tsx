"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Lightweight markdown renderer ─────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (key: string) => {
    if (!listItems.length) return;
    if (listType === "ul") {
      out.push(
        <ul key={key} className="list-disc pl-4 space-y-0.5 my-1">
          {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ul>
      );
    } else {
      out.push(
        <ol key={key} className="list-decimal pl-4 space-y-0.5 my-1">
          {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ol>
      );
    }
    listItems = [];
    listType = null;
  };

  lines.forEach((line, i) => {
    const ulMatch = /^[-*•]\s+(.+)/.exec(line);
    const olMatch = /^\d+\.\s+(.+)/.exec(line);

    if (ulMatch) {
      if (listType && listType !== "ul") flushList(`l${i}`);
      listType = "ul";
      listItems.push(ulMatch[1]);
      return;
    }
    if (olMatch) {
      if (listType && listType !== "ol") flushList(`l${i}`);
      listType = "ol";
      listItems.push(olMatch[1]);
      return;
    }

    flushList(`l${i}`);

    if (line.trim() === "") {
      out.push(<div key={`sp${i}`} className="h-1" />);
      return;
    }
    out.push(<p key={`p${i}`} className="leading-relaxed">{renderInline(line)}</p>);
  });

  flushList("final");
  return <>{out}</>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hey! I'm Abhi, your Makerspace assistant. Ask me anything about 3D printing, Arduino, electronics, competitions, or the club itself!",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.role !== "assistant" || m !== GREETING),
        }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply ?? "Sorry, I had trouble with that." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Connection error — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95",
          "w-16 h-16 overflow-hidden border-2 border-indigo-600 bg-white"
        )}
        aria-label="Chat with Abhi"
      >
        <Image
          src="/images/NerdAbhi.png"
          alt="Abhi"
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col overflow-hidden max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center gap-2 bg-indigo-600 px-4 py-3">
            <Image
              src="/images/NerdAbhi.png"
              alt="Abhi"
              width={36}
              height={36}
              className="rounded-full border-2 border-white object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-white text-sm">Abhi</p>
              <p className="text-xs text-white/80">Makerspace Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 items-end",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {msg.role === "assistant" && (
                  <Image
                    src="/images/NerdAbhi.png"
                    alt="Abhi"
                    width={24}
                    height={24}
                    className="rounded-full flex-shrink-0 object-cover"
                  />
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm leading-relaxed"
                      : "bg-indigo-50 text-gray-800 rounded-bl-sm space-y-0.5"
                  )}
                >
                  {msg.role === "user" ? msg.content : renderMarkdown(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-end">
                <Image
                  src="/images/NerdAbhi.png"
                  alt="Abhi"
                  width={24}
                  height={24}
                  className="rounded-full flex-shrink-0 object-cover"
                />
                <div className="bg-indigo-50 rounded-2xl rounded-bl-sm px-3 py-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-2 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Abhi anything..."
              className="flex-1 text-sm rounded-full border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-indigo-600 text-white rounded-full p-1.5 hover:bg-indigo-700 disabled:opacity-40 transition-colors flex-shrink-0"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
