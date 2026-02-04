import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const PublicNavbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent">
            <Brain className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-foreground">KnowledgeBot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm" className="gradient-accent text-accent-foreground border-0 hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
