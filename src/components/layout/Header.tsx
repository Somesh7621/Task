
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserCheck } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
    navigate('/login');
  };

  // Show back button only if we're not on the dashboard
  const showBackButton = location.pathname !== '/dashboard';
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">TaskFlow</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user.name}
              </span>
              {isAdmin() && (
                <span className="flex items-center text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Admin
                </span>
              )}
            </>
          )}
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="dark:text-purple-300 dark:hover:text-purple-200"
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
