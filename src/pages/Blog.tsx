import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-ai-chatbots",
    title: "Getting Started with AI Chatbots for Your Business",
    excerpt: "Learn how to implement an AI-powered chatbot that understands your business and provides accurate answers to customer queries.",
    category: "Tutorial",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
  },
  {
    id: "2",
    slug: "knowledge-base-best-practices",
    title: "Best Practices for Building a Knowledge Base",
    excerpt: "Discover the key strategies for organizing and maintaining an effective knowledge base that powers your AI assistant.",
    category: "Guide",
    date: "2024-01-10",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=400&fit=crop",
  },
  {
    id: "3",
    slug: "ai-customer-support-revolution",
    title: "How AI is Revolutionizing Customer Support",
    excerpt: "Explore how businesses are using AI chatbots to provide 24/7 support and improve customer satisfaction.",
    category: "Industry",
    date: "2024-01-05",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
  },
  {
    id: "4",
    slug: "reducing-hallucinations-in-ai",
    title: "Reducing AI Hallucinations with Knowledge Grounding",
    excerpt: "Learn techniques to ensure your AI chatbot provides accurate, fact-based responses without making things up.",
    category: "Technical",
    date: "2024-01-01",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  },
];

const Blog = () => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Insights, tutorials, and updates from the KnowledgeBot team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogPosts.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card
                className="h-full border-border/50 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </div>
                    <span className="text-accent text-sm font-medium flex items-center gap-1">
                      Read more
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
