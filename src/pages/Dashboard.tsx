import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, MessageSquare, Globe, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Knowledge Sources",
      value: "0",
      description: "URLs & Documents",
      icon: Database,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Chat Sessions",
      value: "0",
      description: "Total conversations",
      icon: MessageSquare,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Pages Indexed",
      value: "0",
      description: "Searchable pages",
      icon: Globe,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Questions Answered",
      value: "0",
      description: "This month",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your AI knowledge base.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Add your first knowledge source to start building your AI chatbot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/knowledge">
              <Button className="w-full gradient-accent text-accent-foreground border-0 hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Add Knowledge Source
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground text-center">
              You can add website URLs or upload documents (PDF, TXT, MD)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle>Try Your Chatbot</CardTitle>
            <CardDescription>
              Test your AI assistant and see how it answers questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/chatbot">
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Open Chatbot
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground text-center">
              Your chatbot will only answer based on your knowledge sources
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
