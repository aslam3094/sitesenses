import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Upload, FileText, Trash2, Link2, Loader2, Plus, Database, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { knowledgeApi, KnowledgeSource } from "@/lib/api/knowledge";
import { useAuth } from "@/hooks/useAuth";

const KnowledgeSources = () => {
  const { user } = useAuth();
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSources = useCallback(async () => {
    try {
      const data = await knowledgeApi.fetchSources();
      setSources(data);
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast.error('Failed to load knowledge sources');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSources();
      const subscription = knowledgeApi.subscribeToUpdates((updatedSource) => {
        setSources(prev => 
          prev.map(s => s.id === updatedSource.id ? updatedSource : s)
        );
        if (updatedSource.status === 'completed') {
          toast.success(`${updatedSource.name} processed successfully`);
        } else if (updatedSource.status === 'error') {
          toast.error(`Failed to process ${updatedSource.name}: ${updatedSource.error_message}`);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, fetchSources]);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const newSource = await knowledgeApi.addUrl(url);
      setSources([newSource, ...sources]);
      setUrl("");
      toast.success("URL added - scraping in progress");
    } catch (error) {
      console.error('Error adding URL:', error);
      toast.error("Failed to add URL");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = [".pdf", ".txt", ".md"];
    const maxSize = 10 * 1024 * 1024;

    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      
      if (!validTypes.includes(ext)) {
        toast.error(`Invalid file type: ${file.name}. Allowed: PDF, TXT, MD`);
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Max size: 10MB`);
        continue;
      }

      try {
        const newSource = await knowledgeApi.uploadDocument(file);
        setSources(prev => [newSource, ...prev]);
        toast.success(`${file.name} uploaded - processing in progress`);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (source: KnowledgeSource) => {
    try {
      await knowledgeApi.deleteSource(source.id, source.file_path);
      setSources(sources.filter((s) => s.id !== source.id));
      toast.success("Source removed");
    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error("Failed to remove source");
    }
  };

  const getStatusIcon = (status: KnowledgeSource["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
      case "processing":
        return <Loader2 className="h-3.5 w-3.5 text-warning animate-spin" />;
      case "error":
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: KnowledgeSource["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "processing":
        return "bg-warning/10 text-warning";
      case "error":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Knowledge Sources</h1>
        <p className="text-sm text-muted-foreground">
          Add website URLs or upload documents to train your AI chatbot.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2 h-10">
          <TabsTrigger value="url" className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            Add URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-6">
          <div className="p-6 rounded-xl bg-card border border-border/60 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Add Website URL</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Enter a website URL to scrape and index its content.
            </p>
            <form onSubmit={handleAddUrl} className="flex gap-3">
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-10"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !url.trim()}
                className="gradient-accent text-accent-foreground"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Scrape
                  </>
                )}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div className="p-6 rounded-xl bg-card border border-border/60 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Upload Documents</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Upload PDF, TXT, or Markdown files to add to your knowledge base.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button
              variant="outline"
              className="w-full h-28 border-dashed border-2 hover:border-accent/50 hover:bg-accent/[0.03]"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 text-accent animate-spin" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, TXT, MD (Max 10MB)
                  </span>
                </div>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sources List */}
      <div className="p-6 rounded-xl bg-card border border-border/60 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold">Your Knowledge Sources</h3>
            <p className="text-sm text-muted-foreground">
              {fetching
                ? "Loading sources..."
                : sources.length === 0
                  ? "No sources added yet"
                  : `${sources.length} source${sources.length !== 1 ? "s" : ""} in your knowledge base`}
            </p>
          </div>
        </div>

        {fetching ? (
          <div className="text-center py-12">
            <Loader2 className="h-6 w-6 mx-auto mb-3 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Loading your sources...</p>
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Add a website URL or upload documents to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sources.map((source, i) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/40 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {source.source_type === "url" ? (
                    <Globe className="h-4 w-4 text-accent shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{source.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(source.created_at)}</span>
                      {source.status === 'completed' && source.metadata && (
                        <>
                          <span>
                            • {((source.metadata as { charCount?: number }).charCount || 0).toLocaleString()} chars
                          </span>
                          {(source.metadata as { embedding_count?: number }).embedding_count && (
                            <span className="text-accent">
                              • {(source.metadata as { embedding_count?: number }).embedding_count} embeddings
                            </span>
                          )}
                        </>
                      )}
                      {source.status === 'error' && source.error_message && (
                        <span className="text-destructive truncate max-w-[200px]">
                          • {source.error_message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${getStatusColor(source.status)}`}>
                    {getStatusIcon(source.status)}
                    <span className="capitalize">{source.status}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(source)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={source.status === 'processing'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeSources;
