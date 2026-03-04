import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, MessageSquare, Code, Settings, Loader2, TrendingUp, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { chatbotApi, type ChatbotWithStats } from "@/lib/api/chatbot";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Chatbots = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newChatbotName, setNewChatbotName] = useState("");
  const [newChatbotDesc, setNewChatbotDesc] = useState("");

  const { data: chatbots = [], isLoading } = useQuery({
    queryKey: ['chatbots'],
    queryFn: chatbotApi.fetchChatbots,
  });

  const createMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      chatbotApi.createChatbot(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbots'] });
      setIsCreateOpen(false);
      setNewChatbotName("");
      setNewChatbotDesc("");
      toast.success("Chatbot created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => chatbotApi.deleteChatbot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbots'] });
      toast.success("Chatbot deleted");
    },
    onError: () => {
      toast.error("Failed to delete chatbot");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatbotName.trim()) return;
    createMutation.mutate({ name: newChatbotName, description: newChatbotDesc || undefined });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Chatbots</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage up to 3 independent AI chatbots
          </p>
        </div>
        {chatbots.length < 3 && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chatbot</DialogTitle>
                <DialogDescription>
                  Give your chatbot a name and description to get started.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Chatbot Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Customer Support Bot"
                    value={newChatbotName}
                    onChange={(e) => setNewChatbotName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Answers questions about our products"
                    value={newChatbotDesc}
                    onChange={(e) => setNewChatbotDesc(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || !newChatbotName.trim()}>
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Chatbot
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Chatbots Grid */}
      {chatbots.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No chatbots yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first chatbot to get started
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Chatbot
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <Card key={chatbot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                    {chatbot.description && (
                      <CardDescription className="mt-1">
                        {chatbot.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${chatbot.is_active ? 'bg-success' : 'bg-muted'}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold">{chatbot.total_messages}</div>
                    <div className="text-xs text-muted-foreground">Chats</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold">{chatbot.sources_count}</div>
                    <div className="text-xs text-muted-foreground">Sources</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold">{(chatbot.total_tokens / 1000).toFixed(1)}k</div>
                    <div className="text-xs text-muted-foreground">Tokens</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/chatbots/${chatbot.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </Link>
                  <Link to={`/chatbots/${chatbot.id}/sources`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Sources
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Link to={`/chatbots/${chatbot.id}/embed`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <Code className="h-4 w-4 mr-2" />
                      Embed
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this chatbot?")) {
                        deleteMutation.mutate(chatbot.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Limit Notice */}
      {chatbots.length >= 3 && (
        <div className="text-center text-sm text-muted-foreground">
          You've reached the maximum of 3 chatbots. Delete one to create a new one.
        </div>
      )}
    </div>
  );
};

export default Chatbots;
