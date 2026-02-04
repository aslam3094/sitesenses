import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Trash2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ChatMessage, TypingIndicator } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyChat } from "@/components/chat/EmptyChat";
import { chatApi, ChatMessage as ChatMessageType } from "@/lib/api/chat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  persisted?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Chatbot = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['chat-history'],
    queryFn: chatApi.fetchHistory,
    enabled: !!session,
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
    mutationFn: chatApi.clearHistory,
    onSuccess: () => {
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
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
    if (!input.trim() || loading) return;

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
    chatApi.saveMessage('user', input.trim()).catch(console.error);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
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
      if (assistantContent) {
        chatApi.saveMessage('assistant', assistantContent).catch(console.error);
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

  if (historyLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col page-transition">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">AI Chatbot</h1>
            <div className="flex h-6 items-center px-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="h-3 w-3 text-accent mr-1" />
              <span className="text-xs font-medium text-accent">AI Powered</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Get instant answers from your knowledge base
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending}
            className="hover-lift"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col border-border/50 shadow-soft overflow-hidden card-premium">
        <CardHeader className="border-b border-border/50 py-4 bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-accent shadow-sm">
              <Brain className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Knowledge Assistant</CardTitle>
              <CardDescription className="text-xs">
                Powered by your content • Answers in seconds
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
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

        <CardContent className="border-t border-border/50 p-4 bg-gradient-to-r from-muted/20 to-transparent">
          <ChatInput onSend={handleSend} loading={loading} />
          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            💡 Responses are generated exclusively from your knowledge sources
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
