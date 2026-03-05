import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, MessageSquare, Mail } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !issue) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/create-support-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          issue: issue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("Thank you for your feedback! We've sent a confirmation email.");
      } else {
        toast.error(data.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-10">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your feedback. We've received your message and will get back to you soon.
              A confirmation email has been sent to {email}.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-20">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 mb-4">
            <MessageSquare className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Support</h1>
          <p className="text-muted-foreground text-lg">
            Have a question or facing an issue? We're here to help.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Request</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Your Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  What issue are you facing?
                </Label>
                <Textarea
                  id="issue"
                  placeholder="Please describe the issue you're experiencing in detail..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                  rows={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            For urgent inquiries, you can also reach us at{" "}
            <a href="mailto:aslam3094@gmail.com" className="text-accent hover:underline">
              aslam3094@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
