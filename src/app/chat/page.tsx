import { Metadata } from "next";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "AI Ultra Coach | FinishUltra",
  description: "Get personalized ultra running advice from our AI coach. Ask about training, gear, nutrition, and race day prep.",
  alternates: { canonical: "/chat" },
};

export default function ChatPage() {
  return (
    <>
      <Header />
      <main className="h-[calc(100vh-4rem)] flex bg-light">
        <ChatInterface />
      </main>
    </>
  );
}
