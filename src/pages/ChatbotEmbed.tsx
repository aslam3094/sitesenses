import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyCheck, Copy, ArrowLeft, Loader2, Check, Palette } from "lucide-react";
import { toast } from "sonner";
import { chatbotApi, type Chatbot } from "@/lib/api/chatbot";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ChatbotEmbed = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [widgetColor, setWidgetColor] = useState("#6366f1");
  const [widgetTitle, setWidgetTitle] = useState("Chat with us");

  const { data: chatbot, isLoading } = useQuery({
    queryKey: ['chatbot', id],
    queryFn: () => chatbotApi.fetchChatbot(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Chatbot>) => chatbotApi.updateChatbot(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', id] });
      toast.success("Chatbot updated");
    },
    onError: () => {
      toast.error("Failed to update chatbot");
    },
  });

  const embedCode = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.async = true;
    script.setAttribute('data-chatbot-id', '${id}');
    script.setAttribute('data-color', '${widgetColor}');
    script.setAttribute('data-title', '${widgetTitle}');
    document.head.appendChild(script);
  })();
</script>
<div id="sitesense-widget-container"></div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = () => {
    updateMutation.mutate({
      widget_color: widgetColor,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chatbot not found</p>
        <Link to="/chatbots">
          <Button variant="link" className="mt-2">Back to Chatbots</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/chatbots">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Embed {chatbot.name}</h1>
          <p className="text-sm text-muted-foreground">
            Add this chatbot to your website
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Widget Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Widget Settings
            </CardTitle>
            <CardDescription>
              Customize how your widget looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="color">Widget Color</Label>
              <div className="flex gap-3">
                <Input
                  id="color"
                  type="color"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Widget Title</Label>
              <Input
                id="title"
                value={widgetTitle}
                onChange={(e) => setWidgetTitle(e.target.value)}
                placeholder="Chat with us"
              />
            </div>

            <Button 
              onClick={handleSaveSettings} 
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>

            {/* Preview */}
            <div className="pt-4 border-t">
              <Label className="mb-3 block">Preview</Label>
              <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted/30 flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: widgetColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="absolute bottom-2 text-xs text-muted-foreground">{widgetTitle}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>
              Copy this code and paste it into your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-64">
                <code>{embedCode}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Installation Instructions
              </h4>
              <ol className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                <li>Copy the embed code above</li>
                <li>Paste it into your website's HTML</li>
                <li>The chat widget will appear in the bottom-right corner</li>
                <li>Customize the color and title using the settings on the left</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotEmbed;
