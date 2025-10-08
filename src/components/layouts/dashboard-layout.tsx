import { useEffect, useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiTruck,
  FiShoppingCart,
  FiMapPin,
  FiSettings,
  FiMenu,
  FiUser,
  FiStar,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { NavLink, useNavigate, useNavigation } from 'react-router';
import logo from '@/assets/logo-1.png';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown';
import { Link } from '../ui/link';

const Logo = () => (
  <Link className="flex items-center text-white" to={paths.home.getHref()}>
    <img className="h-16 w-20" src={logo} alt="Workflow" />
  </Link>
);

const Progress = () => {
  const { state, location } = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => setProgress(0), [location?.pathname]);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old === 100) {
            clearInterval(timer);
            return 100;
          }
          return Math.min(old + 10, 100);
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [state]);

  if (state !== 'loading') return null;

  return (
    <div
      className="fixed left-0 top-0 h-1 bg-blue-500 transition-all duration-200 ease-in-out"
      style={{ width: `${progress}%` }}
    />
  );
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', to: paths.app.dashboard.getHref(), icon: FiHome },
    {
      name: 'Quick Estimate',
      to: paths.app.QuickEstimate.getHref(),
      icon: FiDollarSign,
    },
    {
      name: 'Detailed Rate Quote',
      to: paths.app.DetailedQuote.getref(),
      icon: FiFileText,
    },
    {
      name: 'Shipment Tracking',
      to: paths.app.ShippmentTracking.getref(),
      icon: FiTruck,
    },
    { name: 'Inbox', to: paths.app.Inbox.getref(), icon: FiMessageSquare },
    // { name: 'Order Entry', to: '/', icon: FiShoppingCart },
    // { name: 'Rating', to: '/', icon: FiStar },
    // { name: 'Track and Trace', to: '/', icon: FiMapPin },
    // { name: 'Users', to: paths.app.users.getHref(), icon: FiUsers },
    // { name: 'Settings', to: '/', icon: FiSettings },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside
        className={`fixed inset-y-0 left-0 z-10 hidden flex-col bg-[hsl(var(--primary))] transition-all duration-300 sm:flex ${
          isCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <div className="flex h-16 items-center px-4">
            {isCollapsed ? (
              <img className="size-10" src={logo} alt="Workflow" />
            ) : (
              <Logo />
            )}
          </div>
          <div className="flex w-full justify-end px-2">
            <Button
              variant="secondary"
              size="sm"
              className="size-8 p-0 text-black hover:bg-[hsl(var(--primary-foreground))] hover:text-white"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <FiChevronRight className="size-4" />
              ) : (
                <FiChevronLeft className="size-4" />
              )}
            </Button>
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-white hover:bg-[hsl(var(--primary-foreground))] hover:text-white',
                  'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                  isActive && 'bg-[hsl(var(--primary-foreground))] text-white',
                  isCollapsed ? 'justify-center' : '',
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'text-gray-400 group-hover:text-gray-300',
                  'mr-4 size-6 shrink-0',
                  isCollapsed && 'mr-0',
                )}
              />
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div
        className={`flex flex-col transition-all duration-300 sm:gap-4 ${
          isCollapsed ? 'sm:pl-20' : 'sm:pl-60'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-[hsl(var(--primary))] px-4 sm:static sm:justify-end sm:border-0 sm:px-6">
          <Progress />
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <FiMenu className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent
              side="left"
              className="bg-black pt-10 text-white sm:max-w-60"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <div className="flex h-16 items-center px-4">
                  <Logo />
                </div>
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'text-white hover:bg-[hsl(var(--primary-foreground))] hover:text-white',
                        'group flex items-center rounded-md p-2 text-base font-medium',
                        isActive && 'bg-gray-900 text-white',
                      )
                    }
                  >
                    <item.icon className="mr-4 size-6 text-gray-400 group-hover:text-gray-300" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </DrawerContent>
          </Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <span className="sr-only">Open user menu</span>
                <FiUser className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(paths.app.profile.getHref())}
              >
                Your Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(paths.auth.login.getHref())}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
