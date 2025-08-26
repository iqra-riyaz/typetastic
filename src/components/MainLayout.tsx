
"use client";

import { Trophy, Settings as SettingsIcon, Keyboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';
import TypetasticLogo from './TypetasticLogo';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { useMounted } from '@/hooks/use-mounted';


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMounted = useMounted();
  
  const menuItems = [
    { href: '/practice', label: 'Practice', icon: Keyboard },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ];
  
  // Hide sidebar on landing page for a cleaner look
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <Link href="/" className="group-data-[collapsible=icon]:hidden">
              <TypetasticLogo iconOnly={false} />
            </Link>
             <Link href="/" className="hidden group-data-[collapsible=icon]:block">
              <TypetasticLogo iconOnly={true} />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
           <div className="p-2">
            <ProfileSwitcher />
           </div>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator />
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8 h-screen overflow-auto">
           {isMounted && (
            <div className="flex items-center justify-between mb-4 -mt-2 md:hidden">
              <Link href="/">
                <TypetasticLogo iconOnly={false} />
              </Link>
            </div>
           )}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
