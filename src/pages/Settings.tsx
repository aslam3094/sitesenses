import { useAuth } from "@/hooks/useAuth";
import { EmbedCodeSection } from "@/components/embed/EmbedCodeSection";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and embed your chatbot.
        </p>
      </div>

      {/* Embed Widget Section */}
      <EmbedCodeSection />

      {/* Account Info */}
      <div className="p-6 rounded-xl bg-card border border-border/60 shadow-card">
        <h3 className="font-semibold mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Email
            </label>
            <p className="text-foreground mt-1">{user?.email || "Not available"}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Account ID
            </label>
            <p className="text-foreground font-mono text-sm mt-1">
              {user?.id || "Not available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
