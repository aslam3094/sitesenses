import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { useState } from "react";

const PublicNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-accent shadow-sm group-hover:shadow-glow transition-shadow duration-300">
            <Brain className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-foreground font-bold">KnowledgeBot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === link.href
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm" variant="accent" className="shadow-sm hover:shadow-glow">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
