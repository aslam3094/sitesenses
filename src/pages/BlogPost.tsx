import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, Share2, Edit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogApi, type BlogPost } from "@/lib/api/blog";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";

const samplePosts: BlogPost[] = [
  {
    id: "1",
    author_id: "sample",
    title: "How AI Chatbots Are Revolutionizing Customer Support",
    slug: "ai-chatbots-revolutionizing-customer-support",
    excerpt: "Discover how AI-powered chatbots are transforming the way businesses handle customer support, reducing response times and improving satisfaction rates.",
    content: `
# How AI Chatbots Are Revolutionizing Customer Support

In today's fast-paced digital world, customers expect instant responses. AI chatbots have emerged as a game-changer for customer support, offering 24/7 availability and consistent service quality.

## The Rise of AI-Powered Support

Traditional customer support teams are often overwhelmed with repetitive queries. AI chatbots can handle these common questions instantly, freeing up human agents to focus on more complex issues.

### Key Benefits

1. **24/7 Availability**: Never miss a customer inquiry, even outside business hours
2. **Instant Responses**: Reduce wait times from minutes to milliseconds
3. **Cost Efficiency**: Reduce support costs by up to 30%
4. **Consistent Quality**: Every customer receives the same high-quality response
5. **Scalability**: Handle unlimited conversations simultaneously

## Implementing Your First AI Chatbot

Starting with an AI chatbot doesn't have to be complicated. Here's what you need to know:

1. Identify common customer questions
2. Choose a platform that integrates with your existing tools
3. Train your chatbot on your specific content and documentation
4. Monitor performance and continuously improve

## Conclusion

AI chatbots are no longer a luxury—they're a necessity for businesses looking to provide excellent customer support while managing costs effectively.
    `,
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    published: true,
    published_at: "2024-01-15",
    meta_title: "AI Chatbots in Customer Support",
    meta_description: "Learn how AI chatbots are revolutionizing customer support",
    created_at: "2024-01-15",
    updated_at: "2024-01-15"
  },
  {
    id: "2",
    author_id: "sample",
    title: "Building a Knowledge Base: A Complete Guide",
    slug: "building-knowledge-base-complete-guide",
    excerpt: "Learn how to create an effective knowledge base that powers your AI chatbot and helps customers find answers instantly.",
    content: `
# Building a Knowledge Base: A Complete Guide

A well-structured knowledge base is the foundation of any successful AI chatbot implementation. This guide walks you through creating one from scratch.

## Why You Need a Knowledge Base

Your knowledge base is the source of truth that your AI chatbot uses to generate responses. The quality of your knowledge base directly impacts the quality of your chatbot's answers.

### What to Include

- Frequently asked questions
- Product documentation
- Troubleshooting guides
- Policy information
- Contact information

## Best Practices

1. **Keep it organized**: Use clear categories and tags
2. **Write for your audience**: Use simple, clear language
3. **Keep it updated**: Regularly review and update content
4. **Monitor gaps**: Track what questions go unanswered

## Conclusion

A well-built knowledge base not only powers your AI chatbot but also helps your customers help themselves.
    `,
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    published: true,
    published_at: "2024-01-20",
    meta_title: "Building a Knowledge Base",
    meta_description: "Complete guide to building a knowledge base for AI chatbots",
    created_at: "2024-01-20",
    updated_at: "2024-01-20"
  },
  {
    id: "3",
    author_id: "sample",
    title: "5 Ways to Reduce Customer Support Costs with AI",
    slug: "reduce-customer-support-costs-with-ai",
    excerpt: "Looking to cut support costs without sacrificing quality? Here are five proven strategies leveraging AI technology.",
    content: `
# 5 Ways to Reduce Customer Support Costs with AI

Customer support can be one of the largest expenses for a business. AI offers powerful solutions to reduce costs while maintaining—or even improving—service quality.

## 1. Automate Common Inquiries

Up to 80% of customer questions are repetitive. AI chatbots can handle these instantly, reducing the workload on your support team.

## 2. Provide Self-Service Options

When customers can find answers themselves, they don't need to contact support. AI-powered search makes finding information effortless.

## 3. Improve First Contact Resolution

AI can help agents find the right answers faster, improving first contact resolution rates and reducing repeat contacts.

## 4. Optimize Agent Workflow

AI can categorize and prioritize tickets, ensuring agents focus on the most important issues first.

## 5. Predict and Prevent Issues

AI can identify patterns in customer inquiries, helping you address problems before they escalate.

## Conclusion

AI isn't about replacing human agents—it's about empowering them to work more efficiently and focus on what matters most: solving complex problems.
    `,
    cover_image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop",
    published: true,
    published_at: "2024-01-25",
    meta_title: "Reduce Support Costs with AI",
    meta_description: "5 proven ways to reduce customer support costs using AI",
    created_at: "2024-01-25",
    updated_at: "2024-01-25"
  },
  {
    id: "4",
    author_id: "sample",
    title: "The Future of AI: What to Expect in 2024",
    slug: "future-of-ai-2024",
    excerpt: "From advanced natural language processing to multimodal AI, explore the cutting-edge developments shaping the future of artificial intelligence.",
    content: `
# The Future of AI: What to Expect in 2024

Artificial intelligence is evolving at an unprecedented pace. Here's what we expect to see in the coming year.

## Multimodal AI

AI systems that can process and understand multiple types of data—text, images, audio, and video—are becoming mainstream.

## Better Context Understanding

Next-generation AI models understand context better than ever, leading to more accurate and relevant responses.

## Improved Personalization

AI will become better at tailoring responses to individual users based on their history and preferences.

## Enhanced Reasoning

Advanced reasoning capabilities mean AI can tackle more complex problems that require logical thinking.

## What This Means for Your Business

These advances will make AI chatbots more capable than ever, enabling more sophisticated customer interactions.

## Conclusion

The future of AI is bright, and businesses that embrace these technologies will have a significant competitive advantage.
    `,
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    published: true,
    published_at: "2024-02-01",
    meta_title: "Future of AI in 2024",
    meta_description: "What to expect from AI in 2024",
    created_at: "2024-02-01",
    updated_at: "2024-02-01"
  }
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useIsAdmin();

  const { data: apiPost, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogApi.fetchPostBySlug(slug!),
    enabled: !!slug,
  });

  const post = apiPost || samplePosts.find(p => p.slug === slug);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <article className="container max-w-4xl">
          <Skeleton className="h-6 w-32 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="aspect-video rounded-xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </article>
      </div>
    );
  }

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

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ''} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="og:type" content="article" />
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
      </Helmet>

      <div className="py-12">
        <article className="container max-w-4xl animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            {isAdmin && (
              <Link to={`/admin/blog?edit=${post.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
          </div>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">Article</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {estimateReadTime(post.content)}
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}
          </header>

          {post.cover_image && (
            <div className="aspect-video overflow-hidden rounded-xl mb-12">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
