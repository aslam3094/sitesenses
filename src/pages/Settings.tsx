import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-foreground">{user?.email || "Not available"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Account ID
            </label>
            <p className="text-foreground font-mono text-sm">
              {user?.id || "Not available"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
