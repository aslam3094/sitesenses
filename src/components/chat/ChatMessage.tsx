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
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : ""}`}>
      {role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-accent">
          <Bot className="h-4 w-4 text-accent-foreground" />
        </div>
      )}
      <div className={`max-w-[80%] ${role === "user" ? "" : "space-y-2"}`}>
        {/* Response label for assistant messages */}
        {role === "assistant" && content && !isLoading && (
          <div className={`flex items-center gap-1.5 text-xs ${
            isNoInfoResponse ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
          }`}>
            {isNoInfoResponse ? (
              <>
                <AlertTriangle className="h-3 w-3" />
                <span>No matching content found</span>
              </>
            ) : (
              <>
                <BookOpen className="h-3 w-3" />
                <span>Answer based on your website and documentation</span>
              </>
            )}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            role === "user"
              ? "bg-accent text-accent-foreground"
              : isNoInfoResponse
                ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                : "bg-muted"
          }`}
        >
          {role === "assistant" ? (
            <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>
                {content || (isLoading ? "Searching your knowledge base..." : "")}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          )}
          <p className="text-xs opacity-70 mt-2">
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
