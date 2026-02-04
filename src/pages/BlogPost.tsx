import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}> = {
  "getting-started-with-ai-chatbots": {
    title: "Getting Started with AI Chatbots for Your Business",
    excerpt: "Learn how to implement an AI-powered chatbot that understands your business and provides accurate answers to customer queries.",
    category: "Tutorial",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=600&fit=crop",
    content: `
# Getting Started with AI Chatbots for Your Business

AI chatbots have revolutionized how businesses interact with their customers. Unlike traditional rule-based chatbots, modern AI-powered assistants can understand context, provide nuanced responses, and learn from your specific content.

## Why Choose an AI Chatbot?

Traditional chatbots follow rigid scripts and can only handle predefined queries. AI chatbots, on the other hand, use natural language processing to understand user intent and provide relevant answers from your knowledge base.

### Key Benefits

1. **24/7 Availability** - Your chatbot never sleeps, providing instant support around the clock.
2. **Scalable Support** - Handle thousands of conversations simultaneously without adding headcount.
3. **Consistent Responses** - Ensure every customer gets accurate, on-brand information.
4. **Reduced Costs** - Lower support ticket volume and free up your team for complex issues.

## How KnowledgeBot Works

KnowledgeBot takes a unique approach to AI chatbots. Instead of generating responses from a general AI model (which can "hallucinate" or make up information), we ground all responses in your actual content.

### Step 1: Add Your Knowledge Sources

Upload your documentation, FAQs, product guides, and website content. Our system indexes everything and creates a searchable knowledge base.

### Step 2: Train Your Bot

The AI learns the context and relationships within your content, understanding not just keywords but the meaning behind your documentation.

### Step 3: Deploy and Engage

Embed the chatbot on your website or use our API to integrate with your existing tools. Start providing instant, accurate answers to your customers.

## Best Practices

- **Keep content updated** - Regularly refresh your knowledge base with new information
- **Monitor conversations** - Review chat logs to identify gaps in your content
- **Set expectations** - Let users know they're talking to an AI assistant
- **Provide escalation paths** - Always offer a way to reach human support

Ready to get started? [Sign up for free](/auth?mode=signup) and create your first AI chatbot in minutes.
    `,
  },
  "knowledge-base-best-practices": {
    title: "Best Practices for Building a Knowledge Base",
    excerpt: "Discover the key strategies for organizing and maintaining an effective knowledge base that powers your AI assistant.",
    category: "Guide",
    date: "2024-01-10",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200&h=600&fit=crop",
    content: `
# Best Practices for Building a Knowledge Base

A well-organized knowledge base is the foundation of an effective AI chatbot. The quality of your chatbot's responses directly depends on the quality and organization of your content.

## Structure Your Content

### Use Clear Hierarchies

Organize content into logical categories and subcategories. This helps the AI understand relationships between topics and provide more contextual answers.

### Write for Clarity

- Use simple, direct language
- Break complex topics into digestible sections
- Include examples and use cases
- Define technical terms

## Keep Content Fresh

Regular updates ensure your chatbot provides current information. Set a schedule to review and update content, especially for:

- Product changes
- Policy updates
- New features
- Seasonal information

## Measure and Improve

Track which questions your chatbot can't answer well. These gaps indicate where your knowledge base needs expansion.

Building a great knowledge base is an ongoing process, but the investment pays dividends in customer satisfaction and support efficiency.
    `,
  },
  "ai-customer-support-revolution": {
    title: "How AI is Revolutionizing Customer Support",
    excerpt: "Explore how businesses are using AI chatbots to provide 24/7 support and improve customer satisfaction.",
    category: "Industry",
    date: "2024-01-05",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    content: `
# How AI is Revolutionizing Customer Support

The customer support landscape is undergoing a dramatic transformation. AI-powered solutions are enabling businesses of all sizes to provide enterprise-level support experiences.

## The Shift to AI-First Support

Modern customers expect instant answers. Studies show that 90% of consumers rate an "immediate" response as important when they have a question. AI chatbots make this possible at scale.

## Real-World Impact

Companies implementing AI support solutions are seeing:

- 70% reduction in first-response time
- 40% decrease in support ticket volume
- 25% improvement in customer satisfaction scores
- Significant cost savings on support operations

## The Human-AI Partnership

The most successful implementations combine AI efficiency with human empathy. AI handles routine questions instantly, while complex issues get routed to human agents who have more time to provide thoughtful support.

The future of customer support isn't about replacing humans—it's about augmenting human capabilities with AI.
    `,
  },
  "reducing-hallucinations-in-ai": {
    title: "Reducing AI Hallucinations with Knowledge Grounding",
    excerpt: "Learn techniques to ensure your AI chatbot provides accurate, fact-based responses without making things up.",
    category: "Technical",
    date: "2024-01-01",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
    content: `
# Reducing AI Hallucinations with Knowledge Grounding

One of the biggest challenges with general-purpose AI chatbots is "hallucination"—when the AI confidently states incorrect information. For business applications, this is unacceptable.

## What Causes Hallucinations?

Large language models are trained to generate plausible-sounding text. When they don't have specific information, they may fill gaps with invented details that sound convincing but are wrong.

## The Knowledge Grounding Solution

KnowledgeBot solves this by grounding all responses in your actual content:

1. **Retrieval-Augmented Generation** - Before generating a response, the system finds relevant content from your knowledge base.

2. **Source Attribution** - Responses are tied to specific documents, making it easy to verify accuracy.

3. **Confidence Scoring** - When the system isn't confident about an answer, it says so rather than guessing.

4. **Scope Limiting** - The chatbot only answers questions it can address from your content.

## The Result

Users get accurate, trustworthy answers that reflect your actual documentation and policies. No more worrying about AI making up product features or giving incorrect advice.

This approach trades some flexibility for reliability—exactly what businesses need for customer-facing applications.
    `,
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-12">
      <article className="container max-w-4xl animate-fade-in">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        </header>

        <div className="aspect-video overflow-hidden rounded-xl mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-slate max-w-none">
          {post.content.split("\n").map((paragraph, i) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h1 key={i} className="text-3xl font-bold mt-8 mb-4">
                  {paragraph.replace("# ", "")}
                </h1>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <li key={i} className="ml-6 text-muted-foreground">
                  {paragraph.replace("- ", "")}
                </li>
              );
            }
            if (paragraph.match(/^\d+\./)) {
              return (
                <li key={i} className="ml-6 text-muted-foreground list-decimal">
                  {paragraph.replace(/^\d+\.\s*/, "")}
                </li>
              );
            }
            if (paragraph.trim()) {
              return (
                <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            }
            return null;
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          <Button variant="ghost">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
