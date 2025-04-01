'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { 
  ChevronRight, 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Home,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Close mobile nav when path changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          <Home size={16} className="inline mr-1" />
          Home
        </Link>
        
        {paths.map((path, i) => {
          currentPath += `/${path}`;
          const isLast = i === paths.length - 1;
          
          return (
            <span key={path} className="flex items-center">
              <ChevronRight size={14} className="mx-1" />
              {isLast ? (
                <span className="font-medium text-foreground capitalize">
                  {path === 'admin' ? 'Dashboard' : path.replace(/-/g, ' ')}
                </span>
              ) : (
                <Link 
                  href={currentPath} 
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {path === 'admin' ? 'Admin' : path.replace(/-/g, ' ')}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Admin navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <Home size={18} className="mr-2" />
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 size={18} className="mr-2" />
    },
    {
      name: 'Educational Content',
      path: '/admin',
      icon: <BookOpen size={18} className="mr-2" />
    },
    {
      name: 'Programs',
      path: '/admin',
      icon: <Calendar size={18} className="mr-2" />
    }
  ];

  if (loading || !user || user.role !== 'admin') {
    return <>{children}</>;
  }

  return (
    <div>
      {/* Desktop & Mobile Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 border-b ">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center">
            <Link href="/admin" className="font-medium text-lg">
              E-Waste Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center text-sm transition-colors hover:text-foreground/80",
                  pathname === item.path 
                    ? "text-foreground font-medium" 
                    : "text-foreground/60"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            {isMobileNavOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm md:hidden">
          <nav className="container grid gap-y-4 py-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center px-2 py-3 text-base rounded-md transition-colors",
                  pathname === item.path 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover:bg-accent/50"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="container py-3 border-b mx-auto">
        {generateBreadcrumbs()}
      </div>

      {/* Main Content */}
      <main className="container py-6 min-h-[calc(100vh-104px)] mx-auto">
        {children}
      </main>
    </div>
  );
}