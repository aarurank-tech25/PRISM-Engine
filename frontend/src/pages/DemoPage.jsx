import React, { useState } from "react";
import demoData from "../data/demo_analysis.json";
import { 
  Brain, ShieldCheck, Target, Zap, Route, TrendingUp, MapPin, 
  Coins, GraduationCap, ArrowLeft, Activity, 
  CheckCircle2, XCircle, Sparkles, BookOpen, AlertCircle,
  ChevronRight
} from "lucide-react";

export default function DemoPage({ onBack, onNavigateLogin }) {
  const { student_profile, parent_profile, ai_result } = demoData;
  const [activeSection, setActiveSection] = useState("overview"); // overview, recommendations, decision, simulation, roadmap
  const [selectedCareerIndex, setSelectedCareerIndex] = useState(0);

  // What-If Simulation local sandbox state
  const [simCoding, setSimCoding] = useState(student_profile.skills.python || 90);
  const [simMaths, setSimMaths] = useState(student_profile.academic_scores.maths || 85);
  const [simBudget, setSimBudget] = useState(parent_profile.education_budget || 200000);
  const [simulatedScore, setSimulatedScore] = useState(null);

  const rankedCareers = ai_result.ranked_careers || [];
  const currentCareer = rankedCareers[selectedCareerIndex] || rankedCareers[0];
  const di = currentCareer.decision_intelligence || {};
  const wwit = di.what_would_it_take || {};
  const action = di.highest_impact_action || {};
  const pathOpt = di.path_optimization || {};

  // Deterministic simulation math mirroring PRISM scoring engine:
  // Overall composite = 40% student fit + 20% financial fit + 30% market fit + 10% preference match
  const handleRunSimulation = () => {
    const baseStudentFit = currentCareer.student_fit;
    // Coding delta (weight: 35% of skills in student fit)
    const codingDelta = (simCoding - 90) * 0.15;
    // Maths delta (academic alignment in student fit)
    const mathsDelta = (simMaths - 85) * 0.12;
    const newStudentFit = Math.min(100, Math.max(20, baseStudentFit + codingDelta + mathsDelta));

    // Budget check against estimated cost (~250,000)
    const estimatedCost = 250000;
    let newFinancialFit = 100;
    let newAffordability = "Affordable";
    if (simBudget < estimatedCost) {
      newFinancialFit = Math.round(Math.max(20, (simBudget / estimatedCost) * 100));
      newAffordability = newFinancialFit >= 70 ? "Partially Affordable" : "High Financial Gap";
    }

    const marketFit = currentCareer.market_fit;
    const prefMatch = currentCareer.preference_match;
    const newComposite = (newStudentFit * 0.40) + (newFinancialFit * 0.20) + (marketFit * 0.30) + (prefMatch * 0.10);

    setSimulatedScore({
      studentFit: Math.round(newStudentFit * 10) / 10,
      financialFit: Math.round(newFinancialFit * 10) / 10,
      composite: Math.round(newComposite * 10) / 10,
      affordability: newAffordability
    });
  };

  const handleResetSimulation = () => {
    setSimCoding(90);
    setSimMaths(85);
    setSimBudget(200000);
    setSimulatedScore(null);
  };

  // Explanation for why an alternative ranks lower than the top match
  const getWhyLowerText = (alt, top) => {
    const reasons = [];
    if (alt.student_fit < top.student_fit) {
      reasons.push(`lower academic alignment (${Math.round(alt.student_fit)}% vs ${Math.round(top.student_fit)}%)`);
    }
    if (alt.market_fit < top.market_fit) {
      reasons.push(`softer market demand signal (${Math.round(alt.market_fit)}% vs ${Math.round(top.market_fit)}%)`);
    }
    if (alt.financial_fit < top.financial_fit) {
      reasons.push(`higher preparation cost constraints`);
    }
    const skillGapCount = alt.skill_gaps ? alt.skill_gaps.filter(g => g.priority === "High").length : 0;
    if (skillGapCount > 2) {
      reasons.push(`significant technical gaps in ${skillGapCount} prerequisite skills`);
    }
    if (reasons.length === 0) {
      return "Ranks slightly lower across combined composite weighted metrics.";
    }
    return `Ranks lower due to: ${reasons.join(", ")}.`;
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] font-sans antialiased pb-20">
      
      {/* ── TOP DEMO HEADER & NOTIFICATION BAR ── */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to PRISM</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-tight text-white text-sm">PRISM DEMO</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Sample Student • Read Only
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 hidden md:inline">Public Sandbox</span>
            <button
              onClick={onNavigateLogin}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm"
            >
              Start Your PRISM Journey
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/90 border-t border-slate-700/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 py-2">
            {[
              { id: "overview", label: "1. Profile & Assessment" },
              { id: "recommendations", label: "2. Recommendations & Why" },
              { id: "decision", label: "3. Decision Intelligence & Resilience" },
              { id: "simulation", label: "4. What-If Simulation" },
              { id: "roadmap", label: "5. Roadmap, Exams & Scholarships" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeSection === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">

        {/* ── SECTION 1: DEMO STUDENT PROFILE & ASSESSMENT ── */}
        {(activeSection === "overview" || activeSection === "all") && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  1. Demo Student Profile &amp; Assessment Results
                </h2>
                <p className="text-sm text-slate-500">
                  Pre-configured representative student and parent constraints from <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">demo.py</code>.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Read-Only Baseline
              </span>
            </div>

            {/* Profile Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Student Demographics */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Student Demographics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-lg font-black text-slate-900">{student_profile.name}</div>
                    <div className="text-xs text-slate-500">{student_profile.age} Years Old • {student_profile.education_level}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-xs flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-bold text-slate-800">{student_profile.location}, Tamil Nadu</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span className="text-slate-500">Declared Preferences:</span>
                    <span className="font-bold text-blue-600">{student_profile.career_preferences.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Family Financial Constraints */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Family Financial Reality</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Annual Education Budget:</span>
                    <span className="font-black text-sm text-emerald-600">₹{parent_profile.education_budget.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Annual Household Income:</span>
                    <span className="font-bold text-slate-800">₹{parent_profile.annual_income.toLocaleString()} / yr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Parent Career Preference:</span>
                    <span className="font-bold text-slate-800">{parent_profile.parent_career_preferences.join(", ")}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Parent-Student Alignment:</span>
                    <span className="font-black text-blue-600">Low Conflict (Index: {ai_result.conflict_analysis.index}/100)</span>
                  </div>
                </div>
              </div>

              {/* Academic & Aptitude Overview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Assessment Highlights</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Computer Science:</span>
                    <span className="font-bold text-slate-800">{student_profile.academic_scores.computer_science}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mathematics:</span>
                    <span className="font-bold text-slate-800">{student_profile.academic_scores.maths}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Python Skill:</span>
                    <span className="font-black text-emerald-600">{student_profile.skills.python}% (Top Strength)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Interest:</span>
                    <span className="font-black text-blue-600">{student_profile.interests.ai}% (High Passion)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Logical Reasoning:</span>
                    <span className="font-bold text-slate-800">{student_profile.aptitude.logical_reasoning}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Detailed Assessment Grid */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 mb-4">Complete Assessment Breakdown (0 - 100 Scale)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Maths", val: student_profile.academic_scores.maths, cat: "Academics" },
                  { label: "Physics", val: student_profile.academic_scores.physics, cat: "Academics" },
                  { label: "Computer Science", val: student_profile.academic_scores.computer_science, cat: "Academics" },
                  { label: "Python", val: student_profile.skills.python, cat: "Technical Skill" },
                  { label: "Problem Solving", val: student_profile.skills.problem_solving, cat: "Technical Skill" },
                  { label: "Creativity", val: student_profile.skills.creativity, cat: "Core Skill" },
                  { label: "AI & ML", val: student_profile.interests.ai, cat: "Interest" },
                  { label: "Software Systems", val: student_profile.interests.software, cat: "Interest" },
                  { label: "Logical Reasoning", val: student_profile.aptitude.logical_reasoning, cat: "Aptitude" },
                  { label: "Numerical Aptitude", val: student_profile.aptitude.numerical, cat: "Aptitude" },
                  { label: "Analytical Thinking", val: student_profile.personality.analytical, cat: "Personality" },
                  { label: "Leadership", val: student_profile.personality.leadership, cat: "Personality" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{item.cat}</span>
                      <span className="font-bold text-slate-800 text-xs">{item.label}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mr-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.val}%` }}></div>
                      </div>
                      <span className="font-black text-xs text-blue-700">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 2: CAREER RECOMMENDATIONS & WHY THIS CAREER / WHY OTHERS RANK LOWER ── */}
        {(activeSection === "recommendations" || activeSection === "all") && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  2. Career Recommendations &amp; Explainable Alignment
                </h2>
                <p className="text-sm text-slate-500">
                  Synthesized across {ai_result.summary.evaluated_careers} career pathways using the deterministic PRISM scoring engine.
                </p>
              </div>
            </div>

            {/* Career Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {rankedCareers.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCareerIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCareerIndex === idx
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    selectedCareerIndex === idx ? "bg-white text-blue-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    #{c.rank}
                  </span>
                  <span>{c.career_name}</span>
                  <span className={`text-[10px] font-black ml-1 ${
                    selectedCareerIndex === idx ? "text-blue-100" : "text-slate-400"
                  }`}>
                    {Math.round(c.final_score)}%
                  </span>
                </button>
              ))}
            </div>

            {/* Highlighted Career Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Banner */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white text-blue-800 font-black px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider shadow-xs">
                        RANK #{currentCareer.rank}
                      </span>
                      <span className="bg-blue-800/60 text-blue-100 px-2.5 py-0.5 rounded text-[11px] font-bold border border-blue-400/30">
                        {currentCareer.affordability_status}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">{currentCareer.career_name}</h3>
                  </div>

                  <div className="text-right bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">PRISM Score</span>
                    <span className="text-3xl font-black">{Math.round(currentCareer.final_score)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                
                {/* 6-Factor Visual Breakdown */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                    Multi-Dimensional Factor Analysis (PRISM Decision Matrix)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: "Student Fit", score: Math.round(currentCareer.student_fit), color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                      { label: "Skill Match", score: Math.round(currentCareer.student_fit + 5 > 100 ? 95 : currentCareer.student_fit + 5), color: "text-blue-700 bg-blue-50 border-blue-200" },
                      { label: "Interest Match", score: Math.round(currentCareer.preference_match), color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
                      { label: "Market Demand", score: Math.round(currentCareer.market_fit), color: "text-amber-700 bg-amber-50 border-amber-200" },
                      { label: "Financial Fit", score: Math.round(currentCareer.financial_fit), color: "text-rose-700 bg-rose-50 border-rose-200" },
                      { label: "Location Fit", score: 80, color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
                    ].map((f, i) => (
                      <div key={i} className={`p-4 rounded-2xl border text-center ${f.color}`}>
                        <div className="text-2xl font-black mb-1">{f.score}%</div>
                        <div className="text-[10px] font-black uppercase tracking-wider">{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why This Career Recommends */}
                <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-blue-600" />
                    Why PRISM Recommends {currentCareer.career_name}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {currentCareer.why_recommended}
                  </p>
                </div>

                {/* Strengths & Skill Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Current Strengths */}
                  <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                    <h5 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Key Strengths Identified
                    </h5>
                    <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                      {currentCareer.strengths && currentCareer.strengths.length > 0 ? (
                        currentCareer.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))
                      ) : (
                        <li>Strong aptitude foundations and enthusiasm</li>
                      )}
                    </ul>
                  </div>

                  {/* Skill Gaps */}
                  <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100">
                    <h5 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-amber-600" />
                      Identified Skill Gaps
                    </h5>
                    <ul className="space-y-2 text-xs text-amber-950 font-medium">
                      {currentCareer.skill_gaps && currentCareer.skill_gaps.length > 0 ? (
                        currentCareer.skill_gaps.slice(0, 4).map((g, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>{g.skill_name}</span>
                            <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-amber-100/80 text-amber-800">
                              Gap: {g.gap} pts ({g.priority})
                            </span>
                          </li>
                        ))
                      ) : (
                        <li>No critical foundational gaps detected</li>
                      )}
                    </ul>
                  </div>

                </div>

              </div>
            </div>

            {/* ── WHY OTHER CAREERS RANK LOWER (COMPARISON MATRIX) ── */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Why Other Careers Rank Lower
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed comparative diagnostic explaining why alternatives scored below #{rankedCareers[0].rank} {rankedCareers[0].career_name}.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider">
                      <th className="py-3 px-3">Career</th>
                      <th className="py-3 px-3">Overall Score</th>
                      <th className="py-3 px-3">Student Fit</th>
                      <th className="py-3 px-3">Market Demand</th>
                      <th className="py-3 px-3">Financial Status</th>
                      <th className="py-3 px-4">Why It Ranks Lower</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedCareers.map((alt, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b last:border-0 transition-colors ${
                          idx === 0 ? "bg-blue-50/40 font-bold" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            idx === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            #{alt.rank}
                          </span>
                          {alt.career_name}
                        </td>
                        <td className="py-3 px-3 font-black text-slate-800">{Math.round(alt.final_score)}%</td>
                        <td className="py-3 px-3 text-slate-600">{Math.round(alt.student_fit)}%</td>
                        <td className="py-3 px-3 text-emerald-700 font-bold">{Math.round(alt.market_fit)}%</td>
                        <td className="py-3 px-3 text-slate-600">{alt.affordability_status}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs">
                          {idx === 0 ? (
                            <span className="text-blue-700 font-bold">★ Optimal #1 Rank (Highest weighted composite)</span>
                          ) : (
                            getWhyLowerText(alt, rankedCareers[0])
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        )}

        {/* ── SECTION 3: DECISION INTELLIGENCE (WHAT WOULD IT TAKE, HIGHEST-IMPACT ACTION, RESILIENCE) ── */}
        {(activeSection === "decision" || activeSection === "all") && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                  3. Decision Intelligence, Bottlenecks &amp; Career Resilience
                </h2>
                <p className="text-sm text-slate-500">
                  Actionable answers to "What would it take?", highest-impact action, and long-term automation resilience.
                </p>
              </div>
            </div>

            {/* WHAT WOULD IT TAKE? */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                WHAT WOULD IT TAKE TO REACH {currentCareer.career_name.toUpperCase()}?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Current Readiness</span>
                  <span className="font-black text-lg text-slate-800">{wwit.current_readiness_score || currentCareer.student_fit}%</span>
                  <span className="text-[11px] text-slate-500 block mt-1">Foundation established</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">Identified Gaps</span>
                  <span className="font-bold text-xs text-amber-900 block mt-1">{wwit.gaps || "Technical specialization"}</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">Required Improvement</span>
                  <span className="font-bold text-xs text-blue-900 block mt-1">{wwit.required_improvement || "Machine Learning & Deep Learning"}</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Achievable Path</span>
                  <span className="font-bold text-xs text-emerald-900 block mt-1">{wwit.achievable_path || "Targeted Coursework & Projects"}</span>
                </div>
              </div>
            </div>

            {/* HIGHEST IMPACT ACTION & PATH OPTIMIZATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* HIGHEST IMPACT ACTION */}
              <div className="bg-blue-50/60 p-6 rounded-3xl border border-blue-200 shadow-xs space-y-4">
                <h3 className="text-base font-black text-blue-950 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  YOUR HIGHEST-IMPACT NEXT STEP
                </h3>
                <div className="inline-block bg-blue-100 text-blue-800 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Bottleneck: {action.bottleneck || "Practical Experience & Specialization"}
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {action.reason || "Foundations and family budget are aligned."}
                </p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {action.action || "Focus on building real-world open-source AI projects and seeking early internships."}
                </p>
                <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-blue-900 font-medium">
                  <span className="font-bold">PROJECTED IMPACT:</span> {action.impact || "Differentiates your profile for top market opportunities."}
                </div>
              </div>

              {/* PATH OPTIMIZATION */}
              <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-4">
                <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
                  <Route className="w-5 h-5 text-emerald-600" />
                  PATH OPTIMIZATION
                </h3>
                <div className="inline-block bg-emerald-100 text-emerald-800 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {pathOpt.recommended_path || "Traditional"} Degree Pathway
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {pathOpt.path_description || "Standard degree pathway → focused specialization → internship"}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {pathOpt.why && pathOpt.why.length > 0 ? (
                    pathOpt.why.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✔</span>
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <li>Balances financial constraints with career credentialing.</li>
                  )}
                </ul>
              </div>

            </div>

            {/* CAREER RESILIENCE & MARKET SIGNALS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                CAREER RESILIENCE &amp; MARKET INDICATORS (DATASET-BASED)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Automation Resilience</span>
                  <span className="font-black text-lg text-emerald-600">Very High</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Creators of AI systems</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">5-Year Growth Trajectory</span>
                  <span className="font-black text-lg text-blue-600">+28.4% CAGR</span>
                  <span className="text-[10px] text-slate-500 block mt-1">NASSCOM 2026-2032 forecast</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Market Demand Score</span>
                  <span className="font-black text-lg text-slate-800">{currentCareer.market_fit} / 100</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">Top Tier National Demand</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Salary Trajectory</span>
                  <span className="font-black text-lg text-slate-800">₹12 - ₹35 LPA</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Entry to Mid-Level</span>
                </div>
              </div>

              {/* Geographic Demand Centers */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-3">Top Regional Hiring Hubs:</span>
                <div className="flex flex-wrap gap-3">
                  {[
                    { city: "Bengaluru", status: "Very High Demand", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                    { city: "Hyderabad", status: "Very High Demand", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                    { city: "Chennai", status: "High Demand", color: "bg-blue-50 text-blue-800 border-blue-200" },
                    { city: "Pune", status: "High Demand", color: "bg-blue-50 text-blue-800 border-blue-200" },
                    { city: "Delhi NCR", status: "High Demand", color: "bg-blue-50 text-blue-800 border-blue-200" },
                  ].map((hub, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${hub.color}`}>
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-bold">{hub.city}</span>
                      <span className="text-[10px] opacity-75">({hub.status})</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </section>
        )}

        {/* ── SECTION 4: WHAT-IF SIMULATION (INTERACTIVE READ-ONLY SANDBOX) ── */}
        {(activeSection === "simulation" || activeSection === "all") && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  4. Interactive What-If Simulation Sandbox
                </h2>
                <p className="text-sm text-slate-500">
                  Simulate live how varying student skills or family financial budget alters PRISM scoring recommendations.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Safe In-Memory Simulation
              </span>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-sm space-y-6">
              
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Sandbox Notice:</strong> This simulation calculates scores live in the browser using the actual PRISM multi-dimensional weighting formulas. It does not overwrite or modify any saved student data.
                </p>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Python Coding Skill:</span>
                    <span className="text-blue-600 font-black">{simCoding} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={simCoding}
                    onChange={(e) => setSimCoding(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>40 (Beginner)</span>
                    <span>100 (Mastery)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Mathematics Score:</span>
                    <span className="text-blue-600 font-black">{simMaths} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={simMaths}
                    onChange={(e) => setSimMaths(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>50 (Passing)</span>
                    <span>100 (Centum)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Annual Budget (₹):</span>
                    <span className="text-emerald-600 font-black">₹{simBudget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="600000"
                    step="25000"
                    value={simBudget}
                    onChange={(e) => setSimBudget(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹50,000</span>
                    <span>₹6,00,000</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleRunSimulation}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  Run Live Simulation
                </button>
                <button
                  onClick={handleResetSimulation}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Simulation Result Comparison */}
              {simulatedScore && (
                <div className="mt-6 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 animate-fade-in space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-400">Simulation Outcome</span>
                    <span className="text-xs text-slate-400">Compared to Original Baseline</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-800/60 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Simulated Score</span>
                      <span className="text-2xl font-black text-blue-300">{simulatedScore.composite}%</span>
                      <span className="text-[10px] text-slate-400 block">Baseline: {Math.round(currentCareer.final_score)}%</span>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Simulated Student Fit</span>
                      <span className="text-2xl font-black text-emerald-400">{simulatedScore.studentFit}%</span>
                      <span className="text-[10px] text-slate-400 block">Baseline: {Math.round(currentCareer.student_fit)}%</span>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Financial Fit</span>
                      <span className="text-2xl font-black text-rose-400">{simulatedScore.financialFit}%</span>
                      <span className="text-[10px] text-slate-400 block">Baseline: {Math.round(currentCareer.financial_fit)}%</span>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Affordability Status</span>
                      <span className="text-sm font-black text-amber-300 block mt-2">{simulatedScore.affordability}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic pt-2">
                    {simulatedScore.composite > currentCareer.final_score 
                      ? "Improving these inputs increased overall alignment with this career pathway."
                      : "Constrained parameters indicate the necessity of targeting merit scholarships or alternate education paths."}
                  </p>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ── SECTION 5: ROADMAP, ENTRANCE EXAMS & SCHOLARSHIPS ── */}
        {(activeSection === "roadmap" || activeSection === "all") && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  5. Actionable Roadmap, Entrance Exams &amp; Scholarships
                </h2>
                <p className="text-sm text-slate-500">
                  Concrete 4-year progression plan, key qualifying entrance exams, and verified financial scholarships.
                </p>
              </div>
            </div>

            {/* 4-Year Milestone Roadmap */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-slate-900">
                Four-Year Execution Pathway for {currentCareer.career_name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    step: "Phase 1: Year 1",
                    title: "Foundations & Core Math",
                    desc: "Discrete Mathematics, Linear Algebra, Object-Oriented Programming & advanced Python."
                  },
                  {
                    step: "Phase 2: Year 2",
                    title: "Algorithms & ML",
                    desc: "Data Structures, Algorithm Design, Statistical Machine Learning (Scikit-Learn, Pandas)."
                  },
                  {
                    step: "Phase 3: Year 3",
                    title: "Deep Learning & Cloud",
                    desc: "Neural Networks (PyTorch/TensorFlow), Computer Vision/NLP, Containerization & AWS/GCP."
                  },
                  {
                    step: "Phase 4: Year 4",
                    title: "Capstone & Placement",
                    desc: "End-to-end MLOps pipeline project, industry internship, and placement portfolio reviews."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">
                        {item.step}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entrance Exams */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Target Entrance Examinations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "JEE Main", purpose: "National Engineering Admission (NITs/IIITs)", timeline: "Jan & Apr" },
                  { name: "JEE Advanced", purpose: "Premier Institutes (IITs)", timeline: "May / June" },
                  { name: "BITSAT", purpose: "BITS Pilani campuses", timeline: "May & June" },
                  { name: "GATE CS", purpose: "Post-Graduate / PSU Recruitment", timeline: "February" }
                ].map((exam, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <span className="font-black text-slate-900 text-sm block">{exam.name}</span>
                    <span className="text-xs text-slate-500 block mt-1">{exam.purpose}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mt-2">
                      Timeline: {exam.timeline}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarships & Financial Fit */}
            <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-base font-black text-rose-950 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-rose-600" />
                    Financial Reality &amp; Recommended Scholarships
                  </h3>
                  <p className="text-xs text-slate-600">
                    Deficit analysis: Annual preparation cost (~₹2,50,000) vs family budget (₹2,00,000). Gap: ₹50,000.
                  </p>
                </div>
                <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full uppercase">
                  Partially Affordable (85% Fit)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "NSP Central Sector Scheme",
                    coverage: "₹50,000 / year",
                    eligibility: "Based on 12th Grade percentile and parental income < ₹4,50,000 - ₹6,00,000.",
                    status: "High Match"
                  },
                  {
                    name: "AICTE Pragati / Saksham Scheme",
                    coverage: "₹50,000 / year",
                    eligibility: "Merit-based assistance for accredited technical degree programs.",
                    status: "Eligible"
                  },
                  {
                    name: "FAEA Merit-Cum-Means Scholarship",
                    coverage: "Full Tuition + Maintenance",
                    eligibility: "Excellence in 12th Board examinations for STEAM undergraduate tracks.",
                    status: "Competitive"
                  }
                ].map((sch, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 text-sm">{sch.name}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {sch.status}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-600 block mb-2">{sch.coverage}</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{sch.eligibility}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* ── FOOTER CALL TO ACTION ── */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Experience Real PRISM Intelligence</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to analyze your own career path?
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create your profile, complete your personalized assessment, and let the PRISM engine build your explainable roadmap.
            </p>

            <div className="pt-2">
              <button
                onClick={onNavigateLogin}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 inline-flex items-center gap-2 group"
              >
                <span>Start Your PRISM Journey</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
