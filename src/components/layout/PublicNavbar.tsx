"use client";

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X, Brain, MessageSquare, Database, FileText, Users, HelpCircle } from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Product",
    description: "Everything you need to build an AI-powered knowledge base.",
    items: [
      {
        title: "AI Chatbot",
        href: "/chatbot",
        icon: MessageSquare,
      },
      {
        title: "Knowledge Base",
        href: "/knowledge",
        icon: Database,
      },
      {
        title: "Documentation",
        href: "/blog",
        icon: FileText,
      },
    ],
  },
  {
    title: "Resources",
    description: "Learn how to get the most out of SiteSense.",
    items: [
      {
        title: "Blog",
        href: "/blog",
        icon: FileText,
      },
      {
        title: "Help Center",
        href: "/#features",
        icon: HelpCircle,
      },
      {
        title: "Community",
        href: "/#features",
        icon: Users,
      },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

function PublicNavbar() {
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full z-50 fixed top-0 left-0 bg-transparent">
      <div className="container mx-auto min-h-20 flex items-center justify-between px-4 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-1 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-background/80 hover:text-background transition-colors"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm bg-transparent text-background/80 hover:text-background hover:bg-background/10 data-[state=open]:bg-background/10">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base font-semibold">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-6 w-fit" asChild>
                              <Link to="/auth?mode=signup">
                                Get Started
                                <MoveRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm h-full justify-end space-y-1">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                asChild
                                key={subItem.title}
                              >
                                <Link
                                  to={subItem.href}
                                  className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors"
                                >
                                  {subItem.icon && (
                                    <subItem.icon className="h-4 w-4 text-accent" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Logo - Center */}
        <div className="flex lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent transition-shadow group-hover:shadow-glow">
              <Brain className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-background font-semibold tracking-tight">SiteSense</span>
          </Link>
        </div>

        {/* Right Side - Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" className="text-background/80 hover:text-background hover:bg-background/10">
              Sign in
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6">
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
            className="text-background hover:bg-background/10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-foreground border-t border-background/10 py-6 px-4 animate-fade-in">
              <div className="container flex flex-col gap-4">
                {navigationItems.map((item) => (
                  <div key={item.title} className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="flex justify-between items-center py-2 text-background hover:text-accent transition-colors"
                      >
                        <span className="text-lg font-medium">{item.title}</span>
                        <MoveRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-background">{item.title}</p>
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.href}
                            onClick={() => setOpen(false)}
                            className="flex justify-between items-center py-2 pl-4 text-background/70 hover:text-accent transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}
                              {subItem.title}
                            </span>
                            <MoveRight className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-background/10">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-background/30 text-background hover:bg-background/10">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
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
