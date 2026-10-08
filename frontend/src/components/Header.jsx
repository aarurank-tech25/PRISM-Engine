import React from "react";
import { Bell, Settings, Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onOpenMobile }) {
  const { currentUser, isDemoMode, logout } = useAuth();
  const displayName = currentUser?.displayName || "Student";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] h-16 flex items-center justify-between px-6 sm:px-8">
      
      {/* Mobile Hamburger Button + Brand Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-extrabold tracking-tight text-slate-900">PRISM Engine</span>
          <span className="hidden sm:inline text-xs text-slate-300">/</span>
          <span className="hidden sm:inline text-xs font-semibold text-slate-500">STEAM Career Intelligence Platform</span>
          {isDemoMode && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
              DEMO MODE
            </span>
          )}
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center space-x-4">
        
        {/* Notification Bell */}
        <button 
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors prism-btn"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>

        {/* Settings button */}
        <button 
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors prism-btn"
          title="Account Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* Profile Details */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-black text-xs shadow-xs">
            {initial}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">{displayName}</div>
            <div className="text-[10px] text-slate-500">{isDemoMode ? "Demo Mode" : "Student Account"}</div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>

    </header>
  );
}
