import { Bot, User, BookOpen, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const NO_INFO_PHRASES = [
  "i don't have that information",
  "i don't have any knowledge sources",
  "i don't have complete information",
];

export const ChatMessage = ({ role, content, timestamp, isLoading }: ChatMessageProps) => {
  const isNoInfoResponse = role === "assistant" && 
    NO_INFO_PHRASES.some(phrase => content.toLowerCase().includes(phrase));

  return (
    <div 
      className={`flex gap-3 ${role === "user" ? "justify-end" : ""}`}
      style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}
    >
      {role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-accent">
          <Bot className="h-4 w-4 text-accent-foreground" />
        </div>
      )}
      <div className={`max-w-[80%] ${role === "user" ? "" : "space-y-1.5"}`}>
        {/* Response label for assistant messages */}
        {role === "assistant" && content && !isLoading && (
          <div className={`flex items-center gap-1.5 text-[10px] font-medium ${
            isNoInfoResponse ? "text-warning" : "text-success"
          }`}>
            {isNoInfoResponse ? (
              <>
                <AlertTriangle className="h-3 w-3" />
                <span>No matching content found</span>
              </>
            ) : (
              <>
                <BookOpen className="h-3 w-3" />
                <span>Answer based on your content</span>
              </>
            )}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            role === "user"
              ? "chat-bubble-user"
              : isNoInfoResponse
                ? "bg-warning/10 border border-warning/20 chat-bubble-assistant"
                : "chat-bubble-assistant"
          }`}
        >
          {role === "assistant" ? (
            <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1">
              <ReactMarkdown>
                {content || (isLoading ? "Searching your knowledge base..." : "")}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
          )}
          <p className="text-[10px] opacity-50 mt-2">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      {role === "user" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

// Typing indicator component
export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-accent">
        <Bot className="h-4 w-4 text-accent-foreground" />
      </div>
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
};
