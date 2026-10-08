import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck,
  Target,
  BarChart2,
  BrainCircuit,
  MapPin,
  Coins,
  Cpu,
  Route
} from "lucide-react";

export default function DashboardPage({ 
  onNavigateCareerIntelligence, 
  onNavigateAssessment, 
  onNavigateRoadmap,
  onNavigateDemo,
  careers = [] 
}) {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16 animate-fade-in">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          {/* Subtle tech background pattern */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-blue-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>PRISM Career Intelligence Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-50 to-blue-300">
            Your Career.<br/>Your Reality.<br/>Your Roadmap.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed font-normal">
            PRISM is an explainable career decision intelligence platform that helps students discover the right career, understand why it fits, evaluate real-world constraints, and build an achievable path forward.
          </p>
          
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border border-blue-400/30 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Core PRISM Philosophy</span>
            </div>
            <p className="text-base sm:text-lg font-black text-white leading-snug">
              &ldquo;PRISM doesn&apos;t just recommend a career. It determines how realistically a student can reach it.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-blue-200/90 mt-1.5 font-medium leading-relaxed">
              We don&apos;t optimize for the perfect career on paper. We optimize for the best achievable career path for the individual.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onNavigateAssessment}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 group prism-btn"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* HERO VISUAL (CSS/SVG based lightweight graphic) */}
        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-12 w-80 h-80">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Core Node */}
            <div className="absolute z-20 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] animate-pulse-slow">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            
            {/* Orbital Nodes */}
            {[
              { icon: Target, label: "PROFILE", angle: 0 },
              { icon: Compass, label: "CAREER", angle: 60 },
              { icon: TrendingUp, label: "MARKET", angle: 120 },
              { icon: MapPin, label: "LOCATION", angle: 180 },
              { icon: Coins, label: "FINANCE", angle: 240 },
              { icon: GraduationCap, label: "ROADMAP", angle: 300 }
            ].map((node, idx) => {
              const radius = 120;
              const rad = (node.angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              
              return (
                <div 
                  key={idx}
                  className="absolute z-10 flex flex-col items-center justify-center"
                  style={{ 
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center animate-float" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-blue-400 shadow-lg">
                      <node.icon className="w-5 h-5" />
                    </div>
                    <span className="mt-2 text-[9px] font-bold tracking-widest text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md">
                      {node.label}
                    </span>
                  </div>
                  
                  {/* Connecting Line (SVG) */}
                  <svg className="absolute top-1/2 left-1/2 -z-10 overflow-visible pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                    <line x1="0" y1="0" x2={-x} y2={-y} stroke="rgba(71,85,105,0.5)" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* THE PROBLEM */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Choosing a career is more than choosing a job.</h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">Traditional counseling looks only at interest. PRISM solves for fit, market signals, and affordability.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 custom-card-shadow custom-card-hover">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Career Fit</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Does this career actually match the student's intrinsic aptitude, academic performance, and genuine interests?</p>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 custom-card-shadow custom-card-hover">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-5 border border-teal-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Market Reality</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Does the actual opportunity exist where and when the student enters the workforce, with resilient long-term demand?</p>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 custom-card-shadow custom-card-hover">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 border border-emerald-100">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Financial Reality</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Can the student and family realistically afford the educational pathway, or is bridge aid/scholarship necessary?</p>
          </div>
        </div>
      </div>

      {/* WHAT MAKES PRISM DIFFERENT */}
      <div className="bg-slate-50/80 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-3 tracking-tight">6 Dimensions of PRISM Intelligence</h2>
        <p className="text-slate-500 text-sm text-center max-w-lg mx-auto mb-10">Every recommendation is scored across multidimensional real-world parameters.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { label: "Student Fit", desc: "Aptitude & academic alignment" },
            { label: "Skill Match", desc: "Current technical readiness" },
            { label: "Interest Match", desc: "Personal preference alignment" },
            { label: "Market Demand", desc: "Indicative industry hiring signals" },
            { label: "Financial Fit", desc: "Pathway affordability & scholarships" },
            { label: "Location Fit", desc: "Regional ecosystem strength" }
          ].map((dim, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 custom-card-shadow custom-card-hover flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center flex-shrink-0 text-xs border border-blue-100">
                0{i+1}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{dim.label}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dim.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRISM INTELLIGENCE FLOW (11-STAGE PIPELINE) */}
      <div id="prism-flow" className="py-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-blue-200">
            <Route className="w-3.5 h-3.5" />
            <span>End-to-End Decision Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">The PRISM Intelligence Flow</h2>
          <p className="text-slate-500 text-sm mt-2">
            A continuous reasoning journey transforming raw student potential into an actionable, resilient career path.
          </p>
        </div>

        {/* 11-Step Flow Grid / Chain */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { num: "01", name: "STUDENT", desc: "Individual Identity" },
              { num: "02", name: "REAL PROFILE", desc: "Aptitude & Academics" },
              { num: "03", name: "ASSESSMENT", desc: "Psychometric Testing" },
              { num: "04", name: "PRISM INTELLIGENCE", desc: "Multi-factor Scoring" },
              { num: "05", name: "CAREER FIT", desc: "Evidence-Based Matching" },
              { num: "06", name: "REALITY CHECK", desc: "Signal vs Risk Audit" },
              { num: "07", name: "WHAT WOULD IT TAKE?", desc: "Prerequisite Gap Plan" },
              { num: "08", name: "HIGHEST-IMPACT ACTION", desc: "Bottleneck Removal" },
              { num: "09", name: "OPTIMIZED PATH", desc: "Feasible Pathway" },
              { num: "10", name: "ROADMAP", desc: "Step-by-step Milestones" },
              { num: "11", name: "SCHOLARSHIP / OPPORTUNITY", desc: "Financial Sustainability" },
            ].map((step, idx) => (
              <div 
                key={idx}
                className={`relative p-4 rounded-2xl border transition-all hover:shadow-md ${
                  idx === 3 || idx === 7 
                    ? "bg-blue-50/80 border-blue-300 shadow-sm" 
                    : "bg-white border-slate-200/90"
                } flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    idx === 3 || idx === 7 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {step.num}
                  </span>
                  {idx < 10 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden lg:block" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">{step.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRISM VS TRADITIONAL CAREER QUIZ (COMPETITIVE DIFFERENTIATION) */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-indigo-200">
            <Target className="w-3.5 h-3.5" />
            <span>Competitive Differentiation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            FROM CAREER QUIZ TO CAREER DECISION INTELLIGENCE
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Why traditional questionnaires fail students — and how PRISM computes true real-world feasibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Quiz Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Conventional Approach</span>
                <h3 className="text-xl font-black text-slate-700">Traditional Career Quiz</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500 font-black text-sm">
                ✕
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-slate-800">Career Suggestion Only:</strong> Produces a static list of jobs with no decision mechanics.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-slate-800">Generic Personality Matching:</strong> Relies on subjective interests without testing actual aptitude or skill readiness.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-slate-800">One Single Final Score:</strong> Obscures real trade-offs and provides zero transparency into why.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-slate-800">No Constraint Modeling:</strong> Completely ignores family financial budgets, tuition costs, and location limits.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✕</span>
                <div>
                  <strong className="text-slate-800">No Action Plan:</strong> Leaves students stranded with no milestone roadmap, courses, or scholarship pathways.
                </div>
              </li>
            </ul>
          </div>

          {/* PRISM Decision Intelligence Card */}
          <div className="rounded-2xl border-2 border-blue-500 bg-gradient-to-b from-blue-50/50 to-white p-6 sm:p-8 flex flex-col shadow-lg shadow-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
              PRISM INTELLIGENCE
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-blue-200/80 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">Decision Intelligence Engine</span>
                <h3 className="text-xl font-black text-slate-900">PRISM Platform</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm shadow-blue-600/30">
                ✓
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900">Actionable Career Decision:</strong> Evaluates true feasibility, not hypothetical career dreams.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900">Real Multi-Dimensional Analysis:</strong> Synthesizes academic fit, verified skills, interest, market demand, and budgets.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900">Explainable Why &amp; Why Lower:</strong> Dynamically demonstrates why #1 won and why alternatives fell behind.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900">Financial + Location Constraints:</strong> Incorporates realistic family budgets, location mobility, and regional demand.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                <div>
                  <strong className="text-slate-900">What-If &amp; Highest-Impact Action:</strong> Live simulation of score improvements with concrete next steps, roadmaps, and scholarships.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* THE UNIQUE PRISM LOOP */}
      <div className="bg-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">PRISM DOESN'T STOP AT RECOMMENDING.</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-12">
            A real decision requires testing, explaining, and mapping the next steps.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {[
              { title: "RECOMMEND", subtitle: "Which career fits?" },
              { title: "EXPLAIN", subtitle: "Why does it fit?" },
              { title: "TEST", subtitle: "What if circumstances change?" },
              { title: "OPTIMIZE", subtitle: "What improvement matters most?" },
              { title: "ACT", subtitle: "What should the student do next?" }
            ].map((node, i, arr) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center p-4 hover:bg-white/20 transition-all cursor-default transform hover:-translate-y-1">
                  <span className="font-black tracking-widest text-sm mb-2">{node.title}</span>
                  <span className="text-[10px] text-blue-100 text-center opacity-80 leading-tight">{node.subtitle}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="md:hidden w-[2px] h-6 bg-white/20 my-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT PRISM GIVES YOU */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-8">What PRISM Gives You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <Compass className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">CAREER INTELLIGENCE</h3>
            <p className="text-sm text-slate-500">Understand which career paths objectively fit your profile and why they are recommended.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <BarChart2 className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">MARKET INTELLIGENCE</h3>
            <p className="text-sm text-slate-500">Understand indicative market demand, industry growth, and opportunity locations.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">DECISION INTELLIGENCE</h3>
            <p className="text-sm text-slate-500">Simulate how changes in your skills, academics, and financial constraints affect your pathway.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <GraduationCap className="w-8 h-8 text-amber-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">ACTIONABLE ROADMAP</h3>
            <p className="text-sm text-slate-500">Turn the AI decision into concrete skills, education pathways, scholarships, and next steps.</p>
          </div>
        </div>
      </div>

      {/* EXAMPLE INSIGHT */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <div className="md:w-1/3 z-10">
          <div className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            Example PRISM Insight
          </div>
          <h3 className="text-2xl font-black mb-2">The Hidden Obstacle</h3>
          <p className="text-slate-400 text-sm italic">This is an illustrative example of PRISM's logic.</p>
        </div>
        <div className="md:w-2/3 z-10 border-l border-slate-700 pl-8">
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            "Your strongest career match is not necessarily your easiest path. PRISM identifies the gap between where you are today and where you need to be—balancing your aptitude with market reality and financial constraints."
          </p>
        </div>
        <div className="absolute right-0 bottom-0 text-slate-800 opacity-20 transform translate-x-1/4 translate-y-1/4">
          <Sparkles className="w-64 h-64" />
        </div>
      </div>

    </div>
  );
}
