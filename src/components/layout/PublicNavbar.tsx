"use client";

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu as NavMenu, MenuItem, ProductItem, HoveredLink } from "@/components/ui/navbar-menu";
import { Menu, MoveRight, X, Brain } from "lucide-react";
import { useState } from "react";

function PublicNavbar() {
  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full z-50 fixed top-0 left-0 bg-transparent">
      <div className="container mx-auto min-h-20 flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent transition-shadow group-hover:shadow-glow">
              <Brain className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-white font-semibold tracking-tight">SiteSense</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <NavMenu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Home">
              <div className="flex flex-col space-y-3 text-sm">
                <HoveredLink to="/">Home Page</HoveredLink>
                <HoveredLink to="/#features">Features</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Products">
              <div className="grid grid-cols-2 gap-4 p-4">
                <ProductItem
                  title="AI Chatbot"
                  href="/chatbot"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
                  description="Build intelligent chatbots"
                />
                <ProductItem
                  title="Knowledge Base"
                  href="/knowledge"
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
                  description="Manage your content"
                />
                <ProductItem
                  title="Embed Widget"
                  href="/widget"
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop"
                  description="Add to your site"
                />
                <ProductItem
                  title="Analytics"
                  href="/dashboard"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
                  description="Track performance"
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Resources">
              <div className="flex flex-col space-y-3 text-sm">
                <HoveredLink to="/blog">Blog</HoveredLink>
                <HoveredLink to="/blog">Documentation</HoveredLink>
                <HoveredLink to="/blog">Help Center</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-3 text-sm">
                <HoveredLink to="/pricing">View Plans</HoveredLink>
                <HoveredLink to="/pricing">Enterprise</HoveredLink>
                <HoveredLink to="/pricing">FAQ</HoveredLink>
              </div>
            </MenuItem>
          </NavMenu>
        </div>

        {/* Right Side - Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign in
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">
              Get started
              <MoveRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!isOpen)}
            className="text-white hover:bg-white/10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-black border-t border-white/10 py-6 px-4 animate-fade-in">
              <div className="container flex flex-col gap-4">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex justify-between items-center py-2 text-white hover:text-white/80 transition-colors"
                >
                  <span className="text-lg font-medium">Home</span>
                  <MoveRight className="w-4 h-4 text-white/40" />
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setOpen(false)}
                  className="flex justify-between items-center py-2 text-white hover:text-white/80 transition-colors"
                >
                  <span className="text-lg font-medium">Pricing</span>
                  <MoveRight className="w-4 h-4 text-white/40" />
                </Link>
                <Link
                  to="/knowledge"
                  onClick={() => setOpen(false)}
                  className="flex justify-between items-center py-2 text-white hover:text-white/80 transition-colors"
                >
                  <span className="text-lg font-medium">Products</span>
                  <MoveRight className="w-4 h-4 text-white/40" />
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setOpen(false)}
                  className="flex justify-between items-center py-2 text-white hover:text-white/80 transition-colors"
                >
                  <span className="text-lg font-medium">Resources</span>
                  <MoveRight className="w-4 h-4 text-white/40" />
                </Link>
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-white text-black hover:bg-white/90">
                      Get started
                      <MoveRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default PublicNavbar;
