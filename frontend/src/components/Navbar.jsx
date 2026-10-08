import React, { useState } from "react";
import { 
  BarChart3, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  Menu, 
  X, 
  User, 
  Settings,
  LayoutDashboard
} from "lucide-react";

export default function Navbar({ activeTab = "market", onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "market", label: "Career Intelligence", icon: BarChart3, badge: "" },
    { id: "assessment", label: "Assessment", icon: Compass },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
    { id: "roadmap", label: "Roadmap", icon: GraduationCap },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick("dashboard")}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              P
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-slate-900">PRISM Engine</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  STEAM Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Career Guidance & Regional Innovation
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-slate-100 text-blue-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right User & Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-right">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold">
                J
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">Student</div>
                <div className="text-[11px] text-slate-500">Student Account</div>
              </div>
            </div>

            <button 
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between px-2 text-xs text-slate-500">
            <span>Signed in as <strong>Student</strong></span>
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Student Profile</span>
          </div>
        </div>
      )}
    </header>
  );
}
