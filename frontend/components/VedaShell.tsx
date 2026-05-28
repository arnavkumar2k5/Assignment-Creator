'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronDown,
  FileText,
  Grid2X2,
  Home,
  LibraryBig,
  Menu,
  Plus,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import clsx from 'clsx';

type ActiveNav = 'home' | 'groups' | 'assignments' | 'toolkit' | 'library';

interface ShellProps {
  active: ActiveNav;
  topTitle?: string;
  backHref?: string;
  children: React.ReactNode;
  floatingCreate?: boolean;
}

const navItems = [
  { key: 'home', label: 'Home', href: '/', icon: Home },
  { key: 'groups', label: 'My Groups', href: '#', icon: Users },
  { key: 'assignments', label: 'Assignments', href: '/assignments', icon: FileText, badge: '10' },
  { key: 'toolkit', label: "AI Teacher's Toolkit", href: '#', icon: BookOpen },
  { key: 'library', label: 'My Library', href: '#', icon: LibraryBig },
] as const;

const bottomItems = [
  { key: 'home', label: 'Home', href: '/', icon: Grid2X2 },
  { key: 'assignments', label: 'Assignments', href: '/assignments', icon: FileText },
  { key: 'library', label: 'Library', href: '#', icon: FileText },
  { key: 'toolkit', label: 'AI Toolkit', href: '#', icon: Sparkles },
] as const;

export function VedaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={clsx('veda-logo', compact ? 'h-7 w-7 rounded-md' : 'h-11 w-11 rounded-xl')} aria-hidden="true">
        <span className={clsx(compact ? 'text-lg' : 'text-3xl')}>V</span>
      </div>
      <span className={clsx('font-bold tracking-[-0.04em] text-veda-ink', compact ? 'text-xl' : 'text-[1.65rem]')}>
        VedaAI
      </span>
    </div>
  );
}

function UserAvatar({ small = false }: { small?: boolean }) {
  return (
    <div className={clsx('avatar-art', small ? 'h-8 w-8' : 'h-12 w-12')}>
      <span>{small ? 'JD' : 'DPS'}</span>
    </div>
  );
}

function DesktopSidebar({ active }: { active: ActiveNav }) {
  return (
    <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-[22rem] max-w-[22vw] min-w-[300px] flex-col rounded-[20px] bg-white px-7 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
      <VedaLogo />

      <Link href="/create" className="mt-14 inline-flex h-[54px] items-center justify-center gap-2 rounded-full border-4 border-[#ff825f] bg-[#262626] px-5 text-base font-bold text-white shadow-inner">
        <Sparkles size={20} fill="white" />
        Create Assignment
      </Link>

      <nav className="mt-14 space-y-3 text-[1.05rem]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={clsx(
                'flex h-11 items-center gap-3 rounded-lg px-4 font-medium text-[#858585] transition',
                isActive && 'bg-[#f0f0f0] font-bold text-veda-ink'
              )}
            >
              <Icon size={22} strokeWidth={2.2} />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge && active === 'assignments' && (
                <span className="rounded-full bg-[#ff5b2e] px-3 py-0.5 text-sm font-bold text-white">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link href="#" className="mb-5 flex items-center gap-3 px-4 text-base font-medium text-[#777]">
          <Settings size={21} />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-2xl bg-[#f0f0f0] p-3">
          <UserAvatar />
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-veda-ink">Delhi Public School</p>
            <p className="truncate text-sm text-[#6f6f6f]">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopChrome({ title, backHref }: { title?: string; backHref?: string }) {
  return (
    <header className="hidden lg:flex h-16 items-center rounded-[18px] bg-white/82 px-6 shadow-[0_12px_36px_rgba(0,0,0,0.08)] backdrop-blur">
      {backHref && (
        <Link href={backHref} className="mr-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-veda-ink shadow-sm">
          <ArrowLeft size={26} />
        </Link>
      )}
      <Grid2X2 className="mr-3 text-[#a9a9a9]" size={25} />
      <span className="text-xl font-bold text-[#a9a9a9]">{title || 'Assignment'}</span>
      <div className="ml-auto flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-veda-ink shadow-sm">
          <Bell size={24} />
          <span className="absolute right-1.5 top-1 h-2.5 w-2.5 rounded-full bg-[#ff5b2e]" />
        </button>
        <div className="flex items-center gap-3 rounded-full bg-white/70 px-3 py-1.5">
          <UserAvatar small />
          <span className="text-base font-bold text-veda-ink">John Doe</span>
          <ChevronDown size={21} />
        </div>
      </div>
    </header>
  );
}

function MobileChrome() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#d1d1d1] px-2.5 pb-3 pt-3">
      <div className="flex h-14 items-center rounded-[14px] bg-white px-3 shadow-sm">
        <VedaLogo compact />
        <div className="ml-auto flex items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f7f7]">
            <Bell size={23} />
            <span className="absolute right-1 top-0 h-2.5 w-2.5 rounded-full bg-[#ff5b2e]" />
          </button>
          <UserAvatar small />
          <Menu size={25} />
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active }: { active: ActiveNav }) {
  return (
    <nav className="fixed bottom-2 left-2 right-2 z-50 grid h-[72px] grid-cols-4 rounded-[24px] bg-[#161616] px-4 lg:hidden">
      {bottomItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <Link key={item.key} href={item.href} className={clsx('flex flex-col items-center justify-center gap-1 text-[11px] font-medium', isActive ? 'text-white' : 'text-[#676767]')}>
            <Icon size={21} fill={isActive ? 'white' : '#676767'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function VedaShell({ active, topTitle = 'Assignment', backHref, children, floatingCreate = true }: ShellProps) {
  const pathname = usePathname();
  const showFab = floatingCreate && pathname !== '/create';

  return (
    <div className="min-h-screen bg-[#d1d1d1] text-veda-ink">
      <DesktopSidebar active={active} />
      <MobileChrome />
      <div className="lg:ml-[calc(max(300px,22vw)+2rem)] lg:p-4">
        <TopChrome title={topTitle} backHref={backHref} />
        <main className="min-h-[calc(100vh-6rem)] px-2.5 pb-28 pt-4 lg:px-0 lg:pb-7 lg:pt-6">
          {children}
        </main>
      </div>
      {showFab && (
        <Link href="/create" className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#ff5b2e] shadow-lg lg:hidden">
          <Plus size={27} />
        </Link>
      )}
      <BottomNav active={active} />
      <div className="fixed bottom-0 left-1/2 z-50 hidden h-1 w-32 -translate-x-1/2 rounded-full bg-[#222]/40 max-lg:block" />
    </div>
  );
}
