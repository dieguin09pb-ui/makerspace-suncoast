"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
          "w-16 h-16 overflow-hidden border-2 border-[#5BA4CF] bg-white"
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
          <div className="flex items-center gap-2 bg-[#5BA4CF] px-4 py-3">
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
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#5BA4CF] text-white rounded-br-sm"
                      : "bg-[#F0F7FF] text-gray-800 rounded-bl-sm"
                  )}
                >
                  {msg.content}
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
                <div className="bg-[#F0F7FF] rounded-2xl rounded-bl-sm px-3 py-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-[#5BA4CF] rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-[#5BA4CF] rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-[#5BA4CF] rounded-full animate-bounce [animation-delay:300ms]" />
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
              className="flex-1 text-sm rounded-full border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5BA4CF]"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-[#5BA4CF] text-white rounded-full p-1.5 hover:bg-[#4a93be] disabled:opacity-40 transition-colors flex-shrink-0"
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
