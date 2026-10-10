import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If session is still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-champagne-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-chocolate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-chocolate-700 tracking-wider">
            Loading BAVIQUE Admin Portal...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login cleanly
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-champagne-50/40 flex flex-col md:flex-row relative">
      {/* Ambient Glassmorphic Background Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-blush-200/40 to-champagne-300/35 blur-[120px] animate-orb-1" />
        <div className="absolute top-1/2 left-1/3 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-gold-300/25 to-champagne-200/35 blur-[130px] animate-orb-2" />
        <div className="absolute bottom-10 right-10 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-rosegold-300/25 to-blush-200/30 blur-[110px] animate-orb-3" />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden glass-nav px-4 py-3 flex items-center justify-between border-b border-champagne-300/80">
        <div className="flex items-center gap-2">
          <img src="/logo-nav.webp" alt="BAVIQUE" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-serif font-bold text-lg text-chocolate-950">BAVIQUE Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-chocolate-800 hover:bg-champagne-200"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-sidebar p-6 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Branding */}
          <div className="flex items-center gap-3 pb-6 border-b border-champagne-200/80">
            <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-tr from-champagne-300 to-gold-400 shadow-sm flex-shrink-0">
              <img
                src="/logo-nav.webp"
                alt="BAVIQUE"
                className="w-full h-full object-cover rounded-[10px] bg-white"
              />
            </div>
            <div>
              <div className="font-serif text-lg font-bold text-chocolate-950 tracking-wide">
                BAVIQUE
              </div>
              <div className="text-[10px] uppercase tracking-widest text-rosegold-500 font-semibold">
                Store Dashboard
              </div>
            </div>
          </div>

          {/* User Badge */}
          <div className="p-3.5 rounded-2xl glass-panel border border-white/80 text-xs shadow-xs">
            <div className="text-[10px] text-chocolate-600 uppercase tracking-wider font-semibold">
              Logged in as
            </div>
            <div className="font-bold text-chocolate-900 truncate mt-0.5">
              {user.name || user.email}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium capitalize mt-0.5">
              ● {user.role || 'Administrator'}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-chocolate-900 text-champagne-100 shadow-sm'
                      : 'text-chocolate-700 hover:bg-champagne-100 hover:text-chocolate-950'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-chocolate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Site & Logout */}
        <div className="pt-6 border-t border-champagne-200 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-chocolate-700 hover:bg-champagne-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-chocolate-500" />
              <span>View Public Store</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Page Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
