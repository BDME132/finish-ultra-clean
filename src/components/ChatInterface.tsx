"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const mockResponses = [
  "Great question! For your first 50K, the most important thing is to build your long run gradually. Start by adding 1-2 miles per week to your longest run. You don't need to run the full 50K distance in training — getting to 20-22 miles is usually enough.\n\nThe Salomon ADV Skin 5 vest is a great starter pack for carrying water and nutrition. Want me to break down a week-by-week plan?",
  "Nutrition is where most first-time ultra runners struggle. The simplest strategy: aim for 200-300 calories per hour after the first hour. Tailwind Endurance Fuel is beginner-friendly because it handles calories AND electrolytes in one drink.\n\nThe biggest mistake? Waiting too long to eat. Start fueling at mile 5, not mile 15!",
  "For shoes, I'd recommend the Hoka Speedgoat 5 for trail or the Hoka Mach for road ultras. The key is cushioning and grip — your feet will thank you after 31 miles.\n\nMake sure to do at least 3-4 long runs in your race shoes before race day. Nothing new on race day is the #1 rule!",
  "Don't worry about pace in your first ultra — seriously. The goal is to finish, not to hit a time. Most first-time 50K runners finish in 6-8 hours, and that's perfectly fine.\n\nWalk the uphills, run the flats and downhills, and eat at every aid station. That strategy alone will get most beginners to the finish line.",
  "Race week is all about rest and preparation. Taper your mileage, eat well (but nothing crazy), and lay out all your gear the night before.\n\nMake a checklist: shoes, socks, vest, nutrition, headlamp (if there's any chance you'll be out after dark), body glide, and your race bib. Check the weather forecast and adjust layers accordingly.",
];

const suggestedPrompts = [
  "I want to run my first 50K",
  "What shoes should I get?",
  "Help me make a nutrition plan",
  "How do I train for an ultra?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIndex = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = mockResponses[responseIndex.current % mockResponses.length];
      responseIndex.current++;

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="font-headline text-2xl font-bold text-dark mb-2">FinishUltra Coach</h2>
            <p className="text-gray text-sm mb-8 max-w-md">
              Ask me anything about ultra running — training, gear, nutrition, race day prep. I&apos;m here to help you get to that finish line.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-sm px-4 py-3 bg-light border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-dark"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray/60 mt-8">
              AI advice — not a replacement for medical or coaching professionals.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                message.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-light text-dark border border-gray-100 rounded-bl-md"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-light text-dark border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about training, gear, nutrition..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
