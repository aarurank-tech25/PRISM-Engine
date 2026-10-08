import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { fetchWithAuth } from "./api";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
import CareerIntelligencePage from "./pages/CareerIntelligencePage";
import CareerDetailPage from "./pages/CareerDetailPage";
import ModulePlaceholder from "./pages/ModulePlaceholder";
import RoadmapPage from "./pages/RoadmapPage";
import AssessmentPage from "./pages/AssessmentPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProfilePage from "./pages/ProfilePage";
import DemoPage from "./pages/DemoPage";

export default function App() {
  const { currentUser, loading: authLoading } = useAuth();

  // "landing" is the public default; changes to "login", then into app tabs after auth
  const [activeTab, setActiveTab] = useState("landing");
  const [selectedCareerId, setSelectedCareerId] = useState(() => {
    return localStorage.getItem("prism_selected_career") || null;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiResult, setAiResult] = useState(() => {
    const saved = localStorage.getItem("prism_ai_result");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  const [studentContext, setStudentContext] = useState(() => {
    const saved = localStorage.getItem("prism_session");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return { studentId: null, parentId: null }; }
    }
    return { studentId: null, parentId: null };
  });

  // Market data — only fetched once the user is authenticated and entering the app
  const [careersData, setCareersData] = useState(null);
  const [locationsData, setLocationsData] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState(null);
  const [initializingProfile, setInitializingProfile] = useState(false);

  // Sync session to localStorage
  useEffect(() => {
    if (studentContext.studentId) {
      localStorage.setItem("prism_session", JSON.stringify(studentContext));
    }
  }, [studentContext]);

  useEffect(() => {
    if (aiResult) {
      localStorage.setItem("prism_ai_result", JSON.stringify(aiResult));
    } else {
      localStorage.removeItem("prism_ai_result");
    }
  }, [aiResult]);

  useEffect(() => {
    if (selectedCareerId) {
      localStorage.setItem("prism_selected_career", selectedCareerId);
    } else {
      localStorage.removeItem("prism_selected_career");
    }
  }, [selectedCareerId]);

  // ── Auth flow: runs when Firebase resolves ──────────────────────────────────
  // Only triggers market fetch + profile lookup once a real user is present.
  useEffect(() => {
    if (authLoading) return;

    if (currentUser) {
      // Authenticated: load market data and restore profile
      setInitializingProfile(true);
      setMarketLoading(true);

      const fetchMarket = fetch("/api/market/careers")
        .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to fetch careers")))
        .then(data => setCareersData(data))
        .catch(err => setMarketError(err.message));

      const fetchLocations = fetch("/api/market/locations")
        .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to fetch locations")))
        .then(data => setLocationsData(data))
        .catch(() => {}); // locations failure is non-fatal

      Promise.all([fetchMarket, fetchLocations]).finally(() => setMarketLoading(false));

      // Restore existing profile for returning users
      fetchWithAuth("/student/me")
        .then(res => {
          if (res.ok) return res.json();
          if (res.status === 404) {
            setActiveTab("profile"); // new user — needs profile setup
            return null;
          }
        })
        .then(studentData => {
          if (studentData) {
            setStudentContext(prev => ({ ...prev, studentId: studentData._id }));
            setActiveTab(aiResult ? "recommendations" : "home");
          }
        })
        .catch(e => {
          console.error("Failed to load user profile", e);
          setActiveTab("home");
        })
        .finally(() => setInitializingProfile(false));
    } else {
      // Not authenticated: always return to public landing, never into protected app
      setActiveTab("landing");
    }
  }, [currentUser, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── PUBLIC LAYER — no auth, no market data needed ──────────────────────────

  // Still resolving Firebase auth state — show minimal spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // PUBLIC: landing page — always accessible, no Firebase/market dependency
  if (activeTab === "landing") {
    return (
      <div className="min-h-screen bg-[#F7F9FC] text-[#172033] font-sans antialiased">
        {/* Minimal public nav */}
        <nav className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-6 sm:px-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-blue-500/20">
              P
            </div>
            <span className="font-black tracking-tight text-slate-900 text-lg">PRISM</span>
            <span className="hidden sm:inline-block text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Intelligence
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab("login")}
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-slate-100/70"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md shadow-blue-500/20 prism-btn"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* The existing DashboardPage IS the landing page — reuse it fully */}
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <DashboardPage
            careers={[]}
            onNavigateAssessment={() => setActiveTab("login")}
            onNavigateCareerIntelligence={() => setActiveTab("login")}
            onNavigateRoadmap={() => setActiveTab("login")}
          />
        </main>
      </div>
    );
  }

  // PUBLIC: demo page — read-only sandbox, no Firebase/auth dependency
  if (activeTab === "demo") {
    return (
      <DemoPage
        onBack={() => setActiveTab("landing")}
        onNavigateLogin={() => setActiveTab("login")}
      />
    );
  }

  // PUBLIC: login page
  if (activeTab === "login") {
    return <Login onBack={() => setActiveTab("landing")} />;
  }

  // ── AUTHENTICATED LAYER ────────────────────────────────────────────────────

  // Waiting on profile lookup or market data after login
  if (initializingProfile || marketLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white selection:bg-blue-500/30">
        <div className="mb-8 relative">
          <div className="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full animate-pulse-slow"></div>
        </div>
        <h2 className="text-xl font-black tracking-widest text-slate-200 mb-2 uppercase">PRISM is analyzing</h2>
        <p className="text-slate-400 text-sm mb-12">Synthesizing multidimensional career intelligence...</p>
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold tracking-widest text-slate-500">
          <span className="text-blue-400 animate-pulse">PROFILE</span>
          <span>→</span>
          <span className="text-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}>FIT</span>
          <span>→</span>
          <span className="text-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }}>MARKET</span>
          <span>→</span>
          <span className="text-blue-400 animate-pulse" style={{ animationDelay: '0.6s' }}>REALITY</span>
          <span>→</span>
          <span className="text-blue-400 animate-pulse" style={{ animationDelay: '0.8s' }}>PATH</span>
        </div>
      </div>
    );
  }

  // Market data failed to load (only shown to authenticated users)
  if (marketError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Backend Connection Failed</h2>
          <p className="text-gray-600 mb-4">{marketError}</p>
          <p className="text-sm text-gray-500">Please ensure the FastAPI backend is running on the correct port and try again.</p>
        </div>
      </div>
    );
  }

  // Protected app — guard: unauthenticated users can't reach here (landing tab enforced above)
  const protectedTabs = ["profile", "assessment", "recommendations", "settings"];
  if (!currentUser && protectedTabs.includes(activeTab)) {
    return <Login onBack={() => setActiveTab("landing")} />;
  }

  const selectedCareer = careersData?.careers?.find(
    (c) => c.career_id === selectedCareerId
  );

  const handleSelectCareer = (careerId) => {
    setSelectedCareerId(careerId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCareers = () => {
    setSelectedCareerId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfileComplete = ({ studentId, parentId }) => {
    setStudentContext({ studentId, parentId });
    setActiveTab("assessment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAssessmentComplete = (result) => {
    setAiResult(result);
    setActiveTab("recommendations");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-row font-sans antialiased selection:bg-[#E8EEFF] selection:text-[#3157D5]">

      {/* 260px Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top SaaS Header */}
        <Header onOpenMobile={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-6 sm:p-8 lg:p-9 max-w-7xl mx-auto w-full">
          {activeTab === "home" && (
            <DashboardPage
              careers={careersData?.careers || []}
              onNavigateCareerIntelligence={() => handleNavigate("market")}
              onNavigateAssessment={() => handleNavigate("assessment")}
              onNavigateRoadmap={() => handleNavigate("roadmap")}
            />
          )}

          {activeTab === "profile" && (
            <ProfilePage
              onComplete={handleProfileComplete}
              onBack={() => handleNavigate("market")}
            />
          )}

          {activeTab === "assessment" && (
            <AssessmentPage
              studentContext={studentContext}
              onComplete={handleAssessmentComplete}
              onBack={() => handleNavigate("profile")}
            />
          )}

          {activeTab === "market" && (
            <>
              {selectedCareerId && selectedCareer ? (
                <CareerDetailPage
                  career={selectedCareer}
                  onBack={handleBackToCareers}
                  onNavigateRoadmap={() => handleNavigate("roadmap")}
                  onNavigateScholarships={() => handleNavigate("scholarships")}
                />
              ) : (
                <CareerIntelligencePage
                  careersData={careersData}
                  locationsData={locationsData}
                  onSelectCareer={handleSelectCareer}
                  onNavigateRoadmap={() => handleNavigate("roadmap")}
                  onNavigateScholarships={() => handleNavigate("scholarships")}
                />
              )}
            </>
          )}

          {activeTab === "recommendations" && (
            <RecommendationsPage
              aiResult={aiResult}
              studentContext={studentContext}
              marketCareers={careersData?.careers || []}
              onSelectCareer={(id) => {
                setSelectedCareerId(id);
                setActiveTab("roadmap");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

          {(activeTab === "roadmap" || activeTab === "scholarships") && (
            <RoadmapPage careerId={selectedCareerId} onBack={() => handleNavigate("market")} />
          )}

          {activeTab === "settings" && (
            <ModulePlaceholder
              title="Platform Settings & Data Sync"
              route="/settings"
              onBack={() => handleNavigate("market")}
            />
          )}

          {activeTab === "help" && (
            <ModulePlaceholder
              title="Help & Career Counseling Support"
              route="/help"
              onBack={() => handleNavigate("market")}
            />
          )}
        </main>

        {/* Clean Footer */}
        <Footer />

      </div>

    </div>
  );
}
