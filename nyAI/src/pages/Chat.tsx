import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { postQuery } from "@/lib/api";
import { Mic, MicOff, RotateCcw, Send, Shield } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Namaste. I'm your legal assistant from ny.ai. I can help you understand your rights under Indian law, explain legal terms in simple language, and suggest next steps.\n\nYour conversation is anonymous. How can I help you today?",
};

const SUGGESTED_QUESTIONS = [
  "What are my rights if I face domestic violence?",
  "Can my landlord evict me without notice?",
  "What should I do if my employer withholds salary?",
  "How do I file an FIR?",
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || isTyping) {
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await postQuery("chatbot", trimmedText);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? `I couldn't reach the chatbot backend right now. ${error.message}`
          : "I couldn't reach the chatbot backend right now.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setIsTyping(false);
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-6 flex flex-col" style={{ minHeight: "calc(100vh - 12rem)" }}>
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl text-foreground">Legal Help Chat</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-safe-green inline-block animate-pulse-gentle" />
                Live backend chat via /chatbot
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={resetConversation}
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </ScrollReveal>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="chat-bubble-bot px-4 py-3 text-sm text-muted-foreground">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4 animate-reveal-up delay-300">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => void sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary bg-sage-light/50 hover:bg-sage-light transition-colors active:scale-[0.97]"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={voiceActive ? "text-destructive" : "text-muted-foreground"}
            onClick={() => setVoiceActive(!voiceActive)}
            title={voiceActive ? "Stop voice input" : "Start voice input"}
          >
            {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your legal question..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Button type="submit" size="icon" variant="default" disabled={!input.trim() || isTyping} className="rounded-xl">
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Requests are sent as JSON with a single query field, and the backend response is shown directly.
        </p>
      </div>
    </Layout>
  );
};

export default Chat;
