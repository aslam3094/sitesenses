import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Check, Code, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const EmbedCodeSection = () => {
  const { session } = useAuth();
  const [copied, setCopied] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState("Chat with us");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");

  const userId = session?.user?.id;
  const baseUrl = window.location.origin;
  
  const widgetUrl = `${baseUrl}/widget?uid=${userId}&color=${encodeURIComponent(primaryColor)}&title=${encodeURIComponent(widgetTitle)}`;

  const embedScript = `<!-- Knowledge Base Chat Widget -->
<script>
(function() {
  var w = document.createElement('iframe');
  w.src = '${widgetUrl}';
  w.style.cssText = 'position:fixed;bottom:0;right:0;width:400px;height:550px;border:none;z-index:999999;background:transparent;';
  w.allow = 'clipboard-write';
  document.body.appendChild(w);
  window.addEventListener('message', function(e) {
    if (e.data.type === 'widget-resize') {
      w.style.width = e.data.isOpen ? '400px' : '80px';
      w.style.height = e.data.isOpen ? '550px' : '80px';
    }
  });
})();
</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedScript);
      setCopied(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handlePreview = () => {
    window.open(widgetUrl, '_blank', 'width=420,height=600');
  };

  if (!userId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Please log in to get your embed code.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Code className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle>Embed Widget</CardTitle>
            <CardDescription>
              Add the chatbot to any website with a simple script
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="widget-title">Widget Title</Label>
            <Input
              id="widget-title"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
              placeholder="Chat with us"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-14 h-10 p-1 cursor-pointer"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#6366f1"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="space-y-2">
          <Label>Embed Code</Label>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap break-all">
              {embedScript}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste this code just before the closing <code>&lt;/body&gt;</code> tag on your website.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview Widget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
