import { Database, MessageSquare, Globe, TrendingUp, Plus, ArrowRight } from "lucide-react";
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
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your AI knowledge base.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="p-5 rounded-xl bg-card border border-border/60 shadow-card animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="p-6 rounded-xl bg-card border border-border/60 shadow-card animate-fade-in-up stagger-4">
          <h3 className="text-lg font-semibold mb-2">Get Started</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Add your first knowledge source to start building your AI chatbot.
          </p>
          <Link to="/knowledge">
            <Button className="w-full gradient-accent text-accent-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add Knowledge Source
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Add website URLs or upload documents (PDF, TXT, MD)
          </p>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border/60 shadow-card animate-fade-in-up stagger-5">
          <h3 className="text-lg font-semibold mb-2">Try Your Chatbot</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Test your AI assistant and see how it answers questions.
          </p>
          <Link to="/chatbot">
            <Button variant="outline" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Open Chatbot
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Your chatbot will only answer based on your knowledge sources
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
