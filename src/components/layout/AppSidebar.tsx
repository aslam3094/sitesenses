import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Database, Settings, LogOut, Brain, ChevronLeft, ChevronRight, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Chatbot", url: "/chatbot", icon: MessageSquare },
  { title: "Knowledge Sources", url: "/knowledge", icon: Database },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [
  { title: "Blog Management", url: "/admin/blog", icon: FileText },
];

const AppSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-accent shadow-sm group-hover:shadow-glow transition-shadow duration-300">
            <Brain className="h-5 w-5 text-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground">KnowledgeBot</span>
              <span className="text-[10px] text-muted-foreground font-medium">AI Assistant</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? "bg-accent text-accent-foreground shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="mt-6">
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>
              </div>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link
                          to={item.url}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                            isActive
                              ? "bg-accent text-accent-foreground shadow-sm"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex flex-col gap-2">
          {!isCollapsed && user && (
            <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground">Free Plan</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-xl"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Sign out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
