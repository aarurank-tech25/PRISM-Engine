import React from "react";
import { 
  Home, 
  User, 
  BarChart3, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Settings, 
  HelpCircle,
  X,
  Layers
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ activeTab, onNavigate, mobileOpen, onCloseMobile }) {
  const { currentUser, isDemoMode } = useAuth();
  const displayName = currentUser?.displayName || "Student";
  const initial = displayName.charAt(0).toUpperCase();

  const mainNav = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "market", label: "Career Intelligence", icon: BarChart3 },
    { id: "assessment", label: "Assessment", icon: Compass },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
    { id: "roadmap", label: "Roadmap", icon: GraduationCap },
  ];

  const moreNav = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] text-[#0F172A]">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate("market")}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">PRISM Engine</div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Career Intelligence
              </div>
            </div>
          </div>

          {mobileOpen && (
            <button 
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-6 px-3.5 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase mb-2">
            Main
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            More
          </div>
          <nav className="space-y-1">
            {moreNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile Mini-Card */}
      <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/60">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{displayName}</div>
            <div className="text-[10px] text-slate-500 truncate">{isDemoMode ? "Demo Mode" : "Student Account"}</div>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (260px) */}
      <aside className="hidden md:block w-[260px] shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCloseMobile}></div>
          <div className="relative w-[280px] max-w-full h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
