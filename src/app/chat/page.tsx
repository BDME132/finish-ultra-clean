import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "AI Ultra Coach | FinishUltra",
  description: "Get personalized ultra running advice from our AI coach. Ask about training, gear, nutrition, and race day prep.",
};

export default function ChatPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <ChatInterface />
      </main>
      <Footer />
    </>
  );
}
