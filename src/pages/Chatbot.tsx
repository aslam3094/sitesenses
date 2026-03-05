import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Trash2, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ChatMessage, TypingIndicator } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyChat } from "@/components/chat/EmptyChat";
import { chatApi, ChatMessage as ChatMessageType } from "@/lib/api/chat";
import { chatbotApi } from "@/lib/api/chatbot";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  persisted?: boolean;
}

const WIDGET_CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/widget-chat`;

const Chatbot = () => {
  const { id: chatbotId } = useParams<{ id: string }>();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chatbot info
  const { data: chatbot, isLoading: chatbotLoading } = useQuery({
    queryKey: ['chatbot', chatbotId],
    queryFn: () => chatbotApi.fetchChatbot(chatbotId!),
    enabled: !!chatbotId,
  });

  // Fetch chat history for this specific chatbot
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['chatbot-chat-history', chatbotId],
    queryFn: () => chatApi.fetchChatbotHistory(chatbotId!),
    enabled: !!chatbotId && !!session,
  });

  // Load history into local state
  useEffect(() => {
    if (history && history.length > 0) {
      setMessages(history.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.created_at),
        persisted: true,
      })));
    }
  }, [history]);

  // Clear history mutation
  const clearMutation = useMutation({
    mutationFn: () => chatApi.clearChatbotHistory(chatbotId!),
    onSuccess: () => {
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ['chatbot-chat-history', chatbotId] });
      toast.success('Chat history cleared');
    },
    onError: () => {
      toast.error('Failed to clear history');
    }
  });

  // Auto-scroll with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages, loading]);

  const handleSend = async (input: string) => {
    if (!input.trim() || loading || !chatbotId) return;

    const userMessage: LocalMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    // Save user message to DB
    chatApi.saveChatbotMessage(chatbotId, 'user', input.trim()).catch(console.error);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const response = await fetch(WIDGET_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          chatbotId,
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Create assistant message placeholder
      setMessages(prev => [...prev, {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => 
                  m.id === assistantId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch { /* ignore */ }
        }
      }

      // Save assistant message to DB
      if (assistantContent && chatbotId) {
        chatApi.saveChatbotMessage(chatbotId, 'assistant', assistantContent).catch(console.error);
      }

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get response";
      toast.error(errorMessage);
      
      const fallbackContent = `I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.`;
      
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.role === "assistant" && !lastMsg.content) {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: fallbackContent } : m
          );
        }
        return [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: fallbackContent,
          timestamp: new Date(),
        }];
      });
    } finally {
      setLoading(false);
    }
  };

  if (chatbotLoading || historyLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">Chatbot not found</p>
          <Link to="/chatbots">
            <Button variant="link" className="mt-2">Back to Chatbots</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col page-transition">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link to="/chatbots">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{chatbot.name}</h1>
              <div className="flex h-6 items-center px-2.5 rounded-full bg-accent/10 border border-accent/20">
                <Sparkles className="h-3 w-3 text-accent mr-1.5" />
                <span className="text-xs font-medium text-accent">AI Powered</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Chat with your knowledge assistant
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-border/60 px-5 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
              <Brain className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{chatbot.name}</h3>
              <p className="text-xs text-muted-foreground">
                Powered by your knowledge sources
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-5">
          {messages.length === 0 ? (
            <EmptyChat />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  isLoading={loading && message.role === "assistant" && !message.content}
                />
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <TypingIndicator />
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border/60 p-4 bg-muted/20">
          <ChatInput onSend={handleSend} loading={loading} />
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            Responses are generated exclusively from your knowledge sources
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
