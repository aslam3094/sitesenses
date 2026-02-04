import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Upload, FileText, Trash2, Link2, Loader2, Plus, Database } from "lucide-react";
import { toast } from "sonner";

interface KnowledgeSource {
  id: string;
  type: "url" | "document";
  name: string;
  status: "pending" | "processing" | "indexed" | "error";
  createdAt: Date;
}

const KnowledgeSources = () => {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    
    // Simulate adding URL
    setTimeout(() => {
      const newSource: KnowledgeSource = {
        id: crypto.randomUUID(),
        type: "url",
        name: url,
        status: "pending",
        createdAt: new Date(),
      };
      setSources([newSource, ...sources]);
      setUrl("");
      setLoading(false);
      toast.success("URL added to knowledge base");
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = [".pdf", ".txt", ".md"];
    const newSources: KnowledgeSource[] = [];

    Array.from(files).forEach((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!validTypes.includes(ext)) {
        toast.error(`Invalid file type: ${file.name}. Allowed: PDF, TXT, MD`);
        return;
      }

      newSources.push({
        id: crypto.randomUUID(),
        type: "document",
        name: file.name,
        status: "pending",
        createdAt: new Date(),
      });
    });

    if (newSources.length > 0) {
      setSources([...newSources, ...sources]);
      toast.success(`${newSources.length} file(s) uploaded`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
    toast.success("Source removed");
  };

  const getStatusColor = (status: KnowledgeSource["status"]) => {
    switch (status) {
      case "indexed":
        return "bg-success/10 text-success";
      case "processing":
        return "bg-warning/10 text-warning";
      case "error":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Knowledge Sources</h1>
        <p className="text-muted-foreground">
          Add website URLs or upload documents to train your AI chatbot.
        </p>
      </div>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Add URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-accent" />
                Add Website URL
              </CardTitle>
              <CardDescription>
                Enter a website URL to crawl and index its content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUrl} className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="gradient-accent text-accent-foreground border-0 hover:opacity-90"
                >
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
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload PDF, TXT, or Markdown files to add to your knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full h-32 border-dashed hover:border-accent hover:bg-accent/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, TXT, MD (Max 10MB)
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sources List */}
      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle>Your Knowledge Sources</CardTitle>
          <CardDescription>
            {sources.length === 0
              ? "No sources added yet"
              : `${sources.length} source${sources.length !== 1 ? "s" : ""} in your knowledge base`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Add a website URL or upload documents to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {source.type === "url" ? (
                      <Globe className="h-5 w-5 text-accent shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 text-accent shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{source.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {source.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                        source.status
                      )}`}
                    >
                      {source.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(source.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeSources;
