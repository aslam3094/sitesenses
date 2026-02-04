import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api/blog";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const Blog = () => {
  const { isAdmin } = useIsAdmin();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts-public'],
    queryFn: blogApi.fetchPublishedPosts,
  });

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

  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Insights, tutorials, and updates from the KnowledgeBot team.
          </p>
          {isAdmin && (
            <Link to="/admin/blog">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Manage Posts
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <CardHeader>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No blog posts yet.</p>
            {isAdmin && (
              <Link to="/admin/blog" className="mt-4 inline-block">
                <Button>Create your first post</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {posts.map((post, i) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card
                  className="h-full border-border/50 shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Article
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {estimateReadTime(post.content)}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-2 mb-4">
                        {post.excerpt}
                      </CardDescription>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.published_at)}
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
        )}
      </div>
    </div>
  );
};

export default Blog;
