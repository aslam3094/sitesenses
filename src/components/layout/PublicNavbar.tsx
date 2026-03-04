"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavDropdown, NavLink, DropdownItem, ProductCard } from "@/components/ui/navbar-menu";
import { Menu, MoveRight, X, Brain } from "lucide-react";
import { useState } from "react";

function PublicNavbar() {
  const [isOpen, setOpen] = useState(false);

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
        <nav className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            
            <NavDropdown label="Products">
              <div className="space-y-1">
                <ProductCard
                  title="AI Chatbot"
                  description="Build intelligent chatbots"
                  href="/chatbot"
                  image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
                />
                <ProductCard
                  title="Knowledge Base"
                  description="Manage your content"
                  href="/knowledge"
                  image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
                />
                <ProductCard
                  title="Embed Widget"
                  description="Add to your site"
                  href="/widget"
                  image="https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop"
                />
                <ProductCard
                  title="Analytics"
                  description="Track performance"
                  href="/dashboard"
                  image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
                />
              </div>
            </NavDropdown>
            
            <NavDropdown label="Resources">
              <DropdownItem to="/blog">Blog</DropdownItem>
              <DropdownItem to="/blog">Documentation</DropdownItem>
              <DropdownItem to="/blog">Help Center</DropdownItem>
            </NavDropdown>
            
            <NavLink to="/pricing">Pricing</NavLink>
          </div>
        </nav>

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
