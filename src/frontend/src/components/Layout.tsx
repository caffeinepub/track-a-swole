import { Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router';
import { Dumbbell, Library, Plus, History, Home, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Layout() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;
  const { identity, clear, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && currentPath !== '/login') {
      navigate({ to: '/login' });
    }
  }, [isInitializing, isAuthenticated, currentPath, navigate]);

  const handleLogout = () => {
    clear();
    navigate({ to: '/login' });
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  // Show login page without layout chrome
  if (currentPath === '/login') {
    return <Outlet />;
  }

  // Show loading state while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg inline-block">
            <Dumbbell className="h-12 w-12 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (handled by useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-amber-500/20 transition-shadow">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Track-A-Swole
              </h1>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <nav className="border-t border-border bg-card sticky bottom-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') && currentPath === '/'
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              to="/exercises"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/exercises')
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Library className="h-5 w-5" />
              <span className="text-xs font-medium">Library</span>
            </Link>
            <Link
              to="/create-session"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/create-session')
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">New</span>
            </Link>
            <Link
              to="/history"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive('/history')
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <History className="h-5 w-5" />
              <span className="text-xs font-medium">History</span>
            </Link>
          </div>
        </div>
      </nav>

      <footer className="border-t border-border bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with 💪 using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'track-a-swole'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
