import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Upload, FileText, Trash2, Link2, Loader2, Plus, ArrowLeft, Check, X, Database } from "lucide-react";
import { toast } from "sonner";
import { chatbotApi } from "@/lib/api/chatbot";
import { knowledgeApi, type KnowledgeSource } from "@/lib/api/knowledge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ChatbotSources = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: chatbot } = useQuery({
    queryKey: ['chatbot', id],
    queryFn: () => chatbotApi.fetchChatbot(id!),
    enabled: !!id,
  });

  const { data: allSources = [], isLoading: sourcesLoading } = useQuery({
    queryKey: ['knowledge-sources'],
    queryFn: knowledgeApi.fetchSources,
  });

  const { data: chatbotSources = [], isLoading: chatbotSourcesLoading } = useQuery({
    queryKey: ['chatbot-sources', id],
    queryFn: () => chatbotApi.fetchChatbotSources(id!),
    enabled: !!id,
  });

  const addSourceMutation = useMutation({
    mutationFn: (sourceId: string) => chatbotApi.addSourceToChatbot(id!, sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-sources', id] });
      toast.success("Source added to chatbot");
    },
    onError: () => {
      toast.error("Failed to add source");
    },
  });

  const removeSourceMutation = useMutation({
    mutationFn: (sourceId: string) => chatbotApi.removeSourceFromChatbot(id!, sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-sources', id] });
      toast.success("Source removed from chatbot");
    },
    onError: () => {
      toast.error("Failed to remove source");
    },
  });

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const newSource = await knowledgeApi.addUrl(url);
      await chatbotApi.addSourceToChatbot(id!, newSource.id);
      queryClient.invalidateQueries({ queryKey: ['knowledge-sources'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot-sources', id] });
      setUrl("");
      toast.success("URL added and linked to chatbot!");
    } catch (error) {
      toast.error("Failed to add URL");
    } finally {
      setLoading(false);
    }
  };

  const isSourceLinked = (sourceId: string) => 
    chatbotSources.some((cs: { source_id: string }) => cs.source_id === sourceId);

  if (!chatbot) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/chatbots">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Manage Sources</h1>
          <p className="text-sm text-muted-foreground">
            Add knowledge sources to train {chatbot.name}
          </p>
        </div>
      </div>

      {/* Add URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Add Website URL
          </CardTitle>
          <CardDescription>
            Enter a website URL to scrape and index its content for this chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUrl} className="flex gap-3">
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Linked Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Linked Knowledge Sources
          </CardTitle>
          <CardDescription>
            These sources will be used to train this chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chatbotSourcesLoading || sourcesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 mx-auto animate-spin text-accent" />
            </div>
          ) : chatbotSources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No knowledge sources linked to this chatbot yet
            </div>
          ) : (
            <div className="space-y-2">
              {chatbotSources.map((cs: { id: string; source_id: string; created_at: string }) => {
                const source = allSources.find((s: KnowledgeSource) => s.id === cs.source_id);
                if (!source) return null;
                
                return (
                  <div
                    key={cs.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {source.source_type === 'url' ? (
                        <Globe className="h-4 w-4 text-accent" />
                      ) : (
                        <FileText className="h-4 w-4 text-accent" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{source.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{source.status}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSourceMutation.mutate(cs.source_id)}
                      disabled={removeSourceMutation.isPending}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Available Sources</CardTitle>
          <CardDescription>
            Link existing knowledge sources to this chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sourcesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 mx-auto animate-spin text-accent" />
            </div>
          ) : allSources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No knowledge sources available. Add some from the Knowledge Sources page.
            </div>
          ) : (
            <div className="space-y-2">
              {allSources.filter((s: KnowledgeSource) => !isSourceLinked(s.id)).map((source: KnowledgeSource) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {source.source_type === 'url' ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{source.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{source.status}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addSourceMutation.mutate(source.id)}
                    disabled={addSourceMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotSources;
