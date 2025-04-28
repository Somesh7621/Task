
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from './Header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    
    if (paths.length === 0) return null;
    
    return (
      <Breadcrumb className="mb-4 px-4 pt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          
          {paths.length > 1 && paths[0] === 'board' && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Board Details</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="fixed bottom-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-full bg-background border-gray-200 dark:border-gray-700"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <main className="flex-1 overflow-auto">
        {generateBreadcrumbs()}
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
