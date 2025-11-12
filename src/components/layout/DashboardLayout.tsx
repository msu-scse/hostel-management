import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  MessageSquare,
  Calendar,
  ClipboardList,
  Bell,
  UserCog,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'warden', 'student'] },
    { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'warden'] },
    { name: 'Rooms', href: '/rooms', icon: DoorOpen, roles: ['admin', 'warden'] },
    { name: 'Fees', href: '/fees', icon: CreditCard, roles: ['admin', 'warden'] },
    { name: 'Complaints', href: '/complaints', icon: MessageSquare, roles: ['admin', 'warden', 'student'] },
    { name: 'Leaves', href: '/leaves', icon: Calendar, roles: ['admin', 'warden', 'student'] },
    { name: 'Attendance', href: '/attendance', icon: ClipboardList, roles: ['admin', 'warden'] },
    { name: 'Staff', href: '/staff', icon: UserCog, roles: ['admin'] },
    { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['admin', 'warden'] },
    
    // Student-specific routes
    { name: 'My Room', href: '/my-room', icon: DoorOpen, roles: ['student'] },
    { name: 'My Fees', href: '/my-fees', icon: CreditCard, roles: ['student'] },
    { name: 'My Complaints', href: '/my-complaints', icon: MessageSquare, roles: ['student'] },
    { name: 'My Leaves', href: '/my-leaves', icon: Calendar, roles: ['student'] },
    { name: 'My Attendance', href: '/my-attendance', icon: ClipboardList, roles: ['student'] },
  ];

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-xl font-bold text-primary">Medhavi HMS</h1>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <aside
          className={cn(
            'fixed left-0 top-0 h-full w-64 transform border-r border-border bg-card transition-transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <h1 className="text-xl font-bold text-primary">Medhavi HMS</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 lg:justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
