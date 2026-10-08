import React, { useState, useEffect } from "react";
import { getRecommendedCourses } from "../data/courseMappings";
import { 
  Brain, MapPin, TrendingUp, GraduationCap, Coins, Briefcase, 
  ChevronRight, CheckCircle2, XCircle, Target, ArrowRight, ShieldAlert, Zap,
  CheckCircle, Route, AlertTriangle, Sparkles, ShieldCheck, Award
} from "lucide-react";

export default function CareerExplanation({ fitData, marketData, onExploreRoadmap }) {
  const [roadmapData, setRoadmapData] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const id = marketData?.career_id || fitData.career_name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const res = await fetch(`/roadmap/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRoadmapData(data);
        }
      } catch (e) {
        console.error("Failed to load roadmap data for insights", e);
      }
    };
    fetchRoadmap();
  }, [marketData, fitData]);

  const formatScore = (val) => Math.round(val || 0);

  const courses = getRecommendedCourses(fitData.career_name);
  const locations = marketData?.top_hiring_locations || [];
  const strengths = fitData.strengths || [];
  const skillGaps = fitData.skill_gaps || [];
  
  const di = fitData.decision_intelligence || {};
  const wwit = di.what_would_it_take || {};
  const action = di.highest_impact_action || {};
  const path = di.path_optimization || {};
  const summary = di.decision_summary || {};

  // Feature 7 & 8: Dynamic Decision Confidence & Resilience
  const confidence = summary.decision_confidence || (fitData.conflict_level === 'high' ? 'LOW' : fitData.student_fit < 50 ? 'MEDIUM' : 'HIGH');
  const confidenceReason = summary.confidence_reason || (
    confidence === 'HIGH' 
      ? "The recommendation is supported by multiple strong signals across academics, interest, and market demand."
      : confidence === 'MEDIUM'
      ? "The career direction is promising, but notable skill or prerequisite gaps require validation."
      : "Important constraints or conflicting signals reduce confidence; preparatory steps advised."
  );

  const resilience = summary.career_resilience || di.career_resilience?.resilience || (
    fitData.conflict_level === 'high' ? 'LOW' : fitData.financial_fit < 60 ? 'MODERATE' : 'HIGH'
  );
  const resilienceExplanation = summary.resilience_explanation || di.career_resilience?.explanation || (
    resilience === 'HIGH'
      ? "The recommendation remains relatively stable under the student's current constraints."
      : resilience === 'MODERATE'
      ? "The recommendation is moderately sensitive to skill acquisition pace and educational funding stability."
      : "The recommendation is sensitive to financial, location, or prerequisite changes."
  );

  // Feature 1: Career Decision Scorecard Dimensions
  const scorecardDimensions = [
    { label: "Academic Fit", score: fitData.student_fit != null ? Math.round(fitData.student_fit) : null, desc: "Aptitude & academic foundation" },
    { label: "Skill Readiness", score: fitData.skill_match != null ? Math.round(fitData.skill_match) : (fitData.student_fit != null ? Math.max(0, Math.round(fitData.student_fit - 5)) : null), desc: "Current technical readiness" },
    { label: "Interest Alignment", score: (fitData.preference_match != null || fitData.interest_match != null) ? Math.round(fitData.preference_match ?? fitData.interest_match) : null, desc: "Intrinsic interest & passion" },
    { label: "Market Demand", score: fitData.market_fit != null ? Math.round(fitData.market_fit) : (marketData?.location_demand_score != null ? Math.round(marketData.location_demand_score) : null), desc: "Industry hiring demand signals" },
    { label: "Financial Feasibility", score: fitData.financial_fit != null ? Math.round(fitData.financial_fit) : null, desc: "Affordability within family budget" },
    { label: "Location Feasibility", score: (marketData?.location_demand_score != null || fitData.location_fit != null) ? Math.round(marketData?.location_demand_score ?? fitData.location_fit) : null, desc: "Regional ecosystem viability" },
    { label: "Overall Career Reality", score: fitData.final_score != null ? Math.round(fitData.final_score) : (fitData.student_fit != null ? Math.round(fitData.student_fit) : null), desc: "Composite PRISM feasibility index" }
  ];

  // Feature 1: Dynamic Scorecard Verdict
  const getScorecardVerdict = () => {
    const fin = fitData.financial_fit;
    const skill = fitData.skill_match ?? (fitData.student_fit ? fitData.student_fit - 5 : null);
    
    if (fin != null && (fin < 50 || (fitData.financial_gap && fitData.financial_gap > 0))) {
      return "Strong opportunity, but educational financing and budget feasibility is currently the main constraint.";
    }
    if (skill != null && (skill < 60 || (fitData.skill_gaps && fitData.skill_gaps.length > 0))) {
      return "Strong opportunity, but technical skill readiness is currently the main bottleneck.";
    }
    if (fitData.conflict_level === 'high') {
      return "High interest alignment, but aptitude and prerequisite readiness require targeted preparation.";
    }
    if (fitData.student_fit >= 70 && (fin == null || fin >= 70)) {
      return "Exceptional balance across academic aptitude, market demand, and financial feasibility.";
    }
    return "Solid career alignment with practical skill-building and milestone execution recommended.";
  };

  // Feature 2: Why This Career? (2-4 evidence-based dynamic reasons)
  const getWhyThisCareerReasons = () => {
    const reasons = [];
    if (fitData.strengths && Array.isArray(fitData.strengths) && fitData.strengths.length > 0) {
      fitData.strengths.slice(0, 2).forEach(s => {
        reasons.push(s.startsWith("Strong") ? s : `Demonstrated aptitude strength: ${s}`);
      });
    }
    if (fitData.student_fit != null && fitData.student_fit >= 60) {
      reasons.push(`Strong academic foundation and subject alignment (${Math.round(fitData.student_fit)}% match)`);
    }
    const pref = fitData.preference_match ?? fitData.interest_match;
    if (pref != null && pref >= 70) {
      reasons.push(`High intrinsic interest and career passion (${Math.round(pref)}% preference alignment)`);
    }
    if (fitData.market_fit != null && fitData.market_fit >= 70) {
      reasons.push(`Strong and resilient industry market demand signal (${Math.round(fitData.market_fit)}%)`);
    }
    if (fitData.financial_fit != null && (fitData.financial_fit >= 75 || fitData.affordability_status === 'Within Budget')) {
      reasons.push(`Financially sustainable pathway (${Math.round(fitData.financial_fit)}% fit) within target budget`);
    }
    if (reasons.length < 2 && fitData.why_recommended) {
      reasons.push(fitData.why_recommended);
    }
    return reasons.slice(0, 4);
  };

  // Feature 6: Career Reality Check Signals
  const getRealityCheckData = () => {
    const good = [];
    const risks = [];
    
    if (fitData.student_fit != null && fitData.student_fit >= 60) {
      good.push(`Solid academic fit (${Math.round(fitData.student_fit)}% alignment)`);
    }
    const pref = fitData.preference_match ?? fitData.interest_match;
    if (pref != null && pref >= 65) {
      good.push(`High intrinsic interest (${Math.round(pref)}% alignment)`);
    }
    if ((fitData.market_fit != null && fitData.market_fit >= 65) || marketData?.market_demand_label === "High") {
      good.push(`Strong market demand signal (${marketData?.market_demand_label || "High"})`);
    }
    if (fitData.financial_fit != null && (fitData.financial_fit >= 70 || fitData.affordability_status === "Within Budget")) {
      good.push("Educational cost aligned with family budget");
    }
    if (good.length === 0) {
      good.push("Foundational aptitude baseline established");
    }

    if (fitData.skill_gaps && fitData.skill_gaps.length > 0) {
      const g = fitData.skill_gaps[0];
      risks.push(`Technical skill gap in ${g.skill_name} (${g.gap} points gap)`);
    }
    if (fitData.financial_gap && fitData.financial_gap > 0) {
      risks.push(`Budget shortfall of ₹${fitData.financial_gap.toLocaleString()}`);
    }
    if (fitData.conflict_level === "high") {
      risks.push("Interest vs current aptitude conflict detected");
    }
    if (fitData.student_fit != null && fitData.student_fit < 50) {
      risks.push("Prerequisite academic score is below typical entry threshold");
    }
    if (risks.length === 0) {
      risks.push("Practical project portfolio needed for competitive market entry");
    }

    let verdict = "Achievable — but not immediately job-ready.";
    if (risks.length >= 2 && (fitData.financial_gap > 0 || fitData.conflict_level === "high")) {
      verdict = "Challenging — Prerequisite preparation and financial optimization are necessary before committing.";
    } else if (risks.length === 1 && (fitData.student_fit ?? 0) >= 75 && (fitData.financial_fit ?? 0) >= 80) {
      verdict = "Highly Achievable — Strong alignment across all dimensions with low transition friction.";
    }

    return { good: good.slice(0, 4), risks: risks.slice(0, 4), verdict };
  };

  const whyReasons = getWhyThisCareerReasons();
  const realityCheck = getRealityCheckData();

  return (
    <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-800 bg-white cursor-default animate-fade-in" onClick={(e) => e.stopPropagation()}>
      
      {/* FEATURE 11: SIGNATURE PRISM POSITIONING MESSAGE */}
      <div className="mb-10 p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl border border-blue-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Signature PRISM Intelligence</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-white leading-snug">
              &ldquo;PRISM doesn&apos;t just recommend a career. It determines how realistically a student can reach it.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              We don&apos;t optimize for the perfect career on paper. We optimize for the best achievable career path for the individual.
            </p>
          </div>
          <div className="flex-shrink-0 bg-blue-600/30 border border-blue-500/40 px-4 py-2 rounded-xl text-center backdrop-blur-sm">
            <span className="text-[10px] uppercase font-bold text-blue-300 block">Reality Score</span>
            <span className="text-2xl font-black text-white">{formatScore(fitData.final_score || fitData.student_fit)}%</span>
          </div>
        </div>
      </div>

      {/* DECISION SUMMARY (EXECUTIVE OVERVIEW - FEATURES 7 & 8) */}
      <div className="mb-10 p-6 sm:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Executive Summary</div>
            <h3 className="font-black text-2xl flex items-center gap-2 text-white">
              <Brain className="w-6 h-6 text-blue-400" />
              PRISM Decision Intelligence
            </h3>
          </div>
          
          {/* Feature 7 & 8 Badges */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Decision Confidence</div>
              <div className={`font-black text-sm tracking-widest ${
                confidence === 'HIGH' ? 'text-emerald-400' : confidence === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {confidence}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Career Resilience</div>
              <div className={`font-black text-sm tracking-widest ${
                resilience === 'HIGH' ? 'text-emerald-400' : resilience === 'MODERATE' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {resilience}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Recommended Career</div>
            <div className="font-black text-xl text-blue-300">{fitData.career_name}</div>
            <div className="text-xs text-slate-300 mt-2 leading-relaxed">{summary.why_recommended || "Highest multi-factor alignment with individual student profile."}</div>
          </div>
          
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] uppercase tracking-widest text-amber-400 mb-1">Primary Constraint</div>
            <div className="font-black text-lg text-amber-300">{summary.biggest_constraint || action.bottleneck || "Technical Readiness"}</div>
            <div className="text-xs text-slate-300 mt-2 leading-relaxed">{summary.highest_impact_action || action.action || "Close identified competency gaps."}</div>
          </div>
          
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/80 sm:col-span-2 lg:col-span-1">
            <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Recommended Path</div>
            <div className="font-black text-lg text-emerald-300">{summary.path_optimization || path.recommended_path || "Standard"} Pathway</div>
            <div className="text-xs text-slate-300 mt-2 leading-relaxed">{path.path_description || `${summary.financial_reality || "Aligned"} educational progression.`}</div>
          </div>
        </div>

        {/* Confidence & Resilience Evidence Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="flex items-start gap-2.5 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Confidence Rationale:</span>
              <span>{confidenceReason}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
            <Target className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Resilience Analysis:</span>
              <span>{resilienceExplanation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 1: CAREER DECISION SCORECARD */}
      <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-black uppercase tracking-widest mb-1">
              <Award className="w-4 h-4" />
              <span>Multi-Factor Evaluation</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">CAREER DECISION SCORECARD</h3>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600">
            Target: <strong className="text-slate-900">{fitData.career_name}</strong>
          </div>
        </div>

        {/* Scorecard Table / Rows */}
        <div className="space-y-3 mb-6">
          {scorecardDimensions.map((dim, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors gap-2">
              <div className="sm:w-1/3">
                <span className="font-bold text-slate-800 text-sm block">{dim.label}</span>
                <span className="text-[11px] text-slate-500 font-medium">{dim.desc}</span>
              </div>
              
              <div className="sm:w-1/2 flex items-center gap-3">
                {dim.score != null ? (
                  <>
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          dim.score >= 75 ? 'bg-emerald-500' : dim.score >= 55 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
                      ></div>
                    </div>
                    <span className="font-black text-slate-900 text-sm w-12 text-right">{dim.score}%</span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 italic">Insufficient data</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Verdict Callout */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 flex items-start gap-3">
          <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-xs uppercase tracking-wider text-blue-700 block mb-0.5">PRISM Decision Verdict</span>
            <p className="text-sm font-medium leading-relaxed">{getScorecardVerdict()}</p>
          </div>
        </div>
      </div>

      {/* FEATURE 2: WHY THIS CAREER? (DYNAMIC EVIDENCE REASONS) */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="font-black text-2xl text-slate-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            WHY THIS CAREER?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Evidence-based dynamic rationale derived from your actual assessment results and verified market signals.
          </p>
        </div>

        {/* Dynamic Reason Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {whyReasons.map((reason, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-blue-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-black flex items-center justify-center flex-shrink-0 text-xs">
                0{i+1}
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed pt-0.5">{reason}</p>
            </div>
          ))}
        </div>
        
        {/* Visual 6-Factor Summary Circles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <FactorCircle label="Career Fit" score={formatScore(fitData.student_fit)} color="emerald" />
          <FactorCircle label="Skill Match" score={formatScore(fitData.skill_match || (fitData.student_fit ? fitData.student_fit - 5 : null))} color="blue" />
          <FactorCircle label="Interest" score={formatScore(fitData.preference_match || fitData.interest_match || 80)} color="indigo" />
          <FactorCircle label="Market Demand" score={formatScore(fitData.market_fit)} color="amber" />
          <FactorCircle label="Financial Fit" score={formatScore(fitData.financial_fit)} color="rose" />
          <FactorCircle label="Location Fit" score={formatScore(marketData?.location_demand_score || 80)} color="cyan" />
        </div>
      </div>

      {/* FEATURE 6: CAREER REALITY CHECK */}
      <div className="mb-12 bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-slate-600 text-xs font-black uppercase tracking-widest mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Honest Constraint Audit</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">CAREER REALITY CHECK</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            PRISM provides unvarnished truth by contrasting positive signals against actual real-world hurdles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* GOOD SIGNALS */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200">
            <h4 className="font-black text-emerald-900 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              GOOD SIGNALS ({realityCheck.good.length})
            </h4>
            <ul className="space-y-2.5">
              {realityCheck.good.map((sig, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-emerald-950 font-medium leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">✓</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CURRENT RISKS */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
            <h4 className="font-black text-amber-900 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              CURRENT RISKS ({realityCheck.risks.length})
            </h4>
            <ul className="space-y-2.5">
              {realityCheck.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-amber-950 font-medium leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PRISM VERDICT */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
            P
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">PRISM Reality Verdict</span>
            <span className="font-black text-slate-900 text-sm">{realityCheck.verdict}</span>
          </div>
        </div>
      </div>

      {/* FEATURE 4: WHAT WOULD IT TAKE? (5-STAGE SEQUENTIAL PIPELINE) */}
      <div className="mb-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-widest mb-1">
            <Target className="w-4 h-4" />
            <span>Feasibility Transformation</span>
          </div>
          <h3 className="font-black text-2xl text-slate-900 tracking-tight">WHAT WOULD IT TAKE?</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            The explicit progression path converting your current profile into the target career role.
          </p>
        </div>

        {/* 5-Stage Sequential Chain */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Stage 1: Current Reality */}
          <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center shadow-sm flex flex-col justify-between">
            <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Current Reality</span>
            <span className="font-black text-slate-900 text-base">Score: {wwit.current_readiness_score || formatScore(fitData.skill_match || fitData.student_fit || 60)}</span>
            <span className="text-[10px] text-slate-500 font-medium mt-1">Developing Baseline</span>
          </div>

          <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 flex-shrink-0" />

          {/* Stage 2: Main Gap */}
          <div className="flex-1 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center shadow-sm flex flex-col justify-between">
            <span className="block text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1">Main Gap</span>
            <span className="font-bold text-amber-900 text-xs leading-snug">{wwit.gaps || (skillGaps.length > 0 ? skillGaps[0].skill_name : "Technical Foundations")}</span>
            <span className="text-[10px] text-amber-700/80 font-medium mt-1">Identified Bottleneck</span>
          </div>

          <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 flex-shrink-0" />

          {/* Stage 3: Required Improvement */}
          <div className="flex-1 bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center shadow-sm flex flex-col justify-between">
            <span className="block text-[10px] uppercase tracking-widest text-blue-700 font-bold mb-1">Required Improvement</span>
            <span className="font-bold text-blue-900 text-xs leading-snug">{wwit.required_improvement || "Move from developing → job-ready"}</span>
            <span className="text-[10px] text-blue-700/80 font-medium mt-1">Competency Target</span>
          </div>

          <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 flex-shrink-0" />

          {/* Stage 4: Achievable Path */}
          <div className="flex-1 bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center shadow-sm flex flex-col justify-between">
            <span className="block text-[10px] uppercase tracking-widest text-indigo-700 font-bold mb-1">Achievable Path</span>
            <span className="font-bold text-indigo-900 text-xs leading-snug">{wwit.achievable_path || path.path_description || "Targeted project milestone execution"}</span>
            <span className="text-[10px] text-indigo-700/80 font-medium mt-1">Strategic Method</span>
          </div>

          <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 flex-shrink-0" />

          {/* Stage 5: Target Career */}
          <div className="flex-1 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center shadow-sm flex flex-col justify-between">
            <span className="block text-[10px] uppercase tracking-widest text-emerald-700 font-bold mb-1">Target Career</span>
            <span className="font-black text-emerald-900 text-xs leading-snug">{fitData.career_name}</span>
            <span className="text-[10px] text-emerald-700/80 font-medium mt-1">Goal Achieved</span>
          </div>
        </div>
      </div>

      {/* FEATURE 5: ⚡ HIGHEST-IMPACT ACTION + PATH OPTIMIZATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* SIGNATURE: HIGHEST-IMPACT ACTION */}
        <div className="p-6 sm:p-7 rounded-3xl border shadow-sm bg-gradient-to-br from-blue-50/90 to-indigo-50/40 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-lg flex items-center gap-2 text-slate-900">
              <Zap className="w-5 h-5 text-blue-600" />
              ⚡ HIGHEST-IMPACT ACTION
            </h3>
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              {action.bottleneck || "Technical Readiness"}
            </span>
          </div>
          <p className="font-bold text-slate-800 text-sm mb-2">{action.reason || "Current readiness represents the largest actionable lever."}</p>
          <p className="text-slate-600 leading-relaxed text-xs mb-4 font-medium">{action.action || "Prioritize practical project building and core foundational modules."}</p>
          <div className="text-xs font-medium text-blue-900 bg-white/80 p-3 rounded-xl border border-blue-200/80">
            <strong className="text-blue-700 uppercase tracking-wider text-[10px] block mb-0.5">Projected Impact:</strong> 
            {action.impact || "Directly increases academic alignment and unlocks higher-tier opportunities."}
          </div>
        </div>

        {/* SIGNATURE: PATH OPTIMIZATION */}
        <div className="p-6 sm:p-7 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-teal-50/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-lg flex items-center gap-2 text-slate-900">
              <Route className="w-5 h-5 text-emerald-600" />
              PATH OPTIMIZATION
            </h3>
            <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              {path.recommended_path || "Standard"} Pathway
            </span>
          </div>
          <p className="font-bold text-slate-800 text-sm mb-2">{path.path_description || "Standard comprehensive educational pathway."}</p>
          <ul className="text-slate-600 leading-relaxed text-xs list-disc pl-4 space-y-1 font-medium">
            {path.why && Array.isArray(path.why) ? (
              path.why.map((r, i) => <li key={i}>{r}</li>)
            ) : (
              <li>Optimized based on student academic readiness and available resource bounds.</li>
            )}
          </ul>
        </div>
      </div>

      {/* MARKET OUTLOOK */}
      <div className="mb-10 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          Indicative Market Outlook (Dataset-Based)
        </h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[150px]">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Demand Signal</span>
            <span className="text-xl font-black text-slate-800">{marketData?.market_demand_label || "High"}</span>
          </div>
          <div className="flex-1 min-w-[150px]">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Growth Trend</span>
            <span className="text-xl font-black text-emerald-600">{marketData?.future_growth_rate || "Growing"}</span>
          </div>
          <div className="flex-1 min-w-[150px]">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Salary Potential</span>
            <span className="text-xl font-black text-slate-800">{marketData?.salary_potential || "High"}</span>
          </div>
        </div>
      </div>

      {/* LOCATION INTELLIGENCE */}
      <div className="mb-10">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-600" />
          Where This Career is Strongest
        </h3>
        {locations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {locations.slice(0, 6).map((loc, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-2xl bg-white shadow-sm hover:border-cyan-200 transition-colors">
                <span className="font-bold text-slate-800">{loc.city}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                  loc.demand_level === 'Very High' ? 'bg-emerald-100 text-emerald-800' :
                  loc.demand_level === 'High' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {loc.demand_level}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">Location-specific market data is currently unavailable.</p>
        )}
      </div>

      {/* SKILLS TO BUILD */}
      <div className="mb-10">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Skills for This Career
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
            <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600"/> Current Strengths</h4>
            <ul className="space-y-3 text-sm text-emerald-900 font-medium">
              {strengths.length > 0 ? strengths.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500">•</span> {s}</li>) : <li>Solid baseline aptitude</li>}
            </ul>
          </div>
          <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 shadow-sm">
            <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-amber-600"/> Key Skill Gaps</h4>
            <ul className="space-y-3 text-sm text-amber-900 font-medium">
              {skillGaps.length > 0 ? skillGaps.map((g, i) => (
                <li key={i} className="flex flex-col">
                  <div className="flex items-start gap-2"><span className="text-amber-500">•</span> {g.skill_name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-700/70 ml-4 mt-0.5">Gap: {g.gap} points</div>
                </li>
              )) : <li>No critical gaps detected</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* RECOMMENDED EDUCATION */}
      <div className="mb-10">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Recommended Education Pathway
        </h3>
        <div className="flex flex-col gap-3 bg-white p-6 border rounded-3xl shadow-sm">
          {courses.map((c, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-black text-xs">{i+1}</span>
              <span className="text-slate-800 font-bold">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FINANCIAL & SCHOLARSHIPS */}
      <div className="mb-10">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-rose-600" />
          Financial Reality & Scholarships
        </h3>
        <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-slate-800">Financial Fit Score</span>
            <span className="font-black text-2xl text-rose-600">{formatScore(fitData.financial_fit)}<span className="text-sm text-rose-400">/100</span></span>
          </div>
          <p className="text-slate-700 font-medium mb-6">
            {roadmapData?.financial_fit?.action_recommendation || 
             (fitData.financial_gap > 0 ? `A financial gap of \u20B9${fitData.financial_gap.toLocaleString()} was detected.` : "This pathway is financially aligned with your profile.")}
          </p>
          
          {roadmapData?.scholarships && roadmapData.scholarships.length > 0 && (
            <div className="mt-6 pt-6 border-t border-rose-200">
              <h4 className="font-black text-slate-900 mb-4 uppercase tracking-widest text-xs">Recommended Scholarships for You:</h4>
              <div className="space-y-4">
                {roadmapData.scholarships.map((sch, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-0.5">
                    <div className="font-black text-blue-700">{sch.name}</div>
                    <div className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">Why eligible:</span> 
                      <span className="font-medium text-slate-700">{sch.why_eligible}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ROADMAP CTA */}
      <div className="flex justify-center mt-10">
        <button 
          onClick={(e) => { e.stopPropagation(); onExploreRoadmap(); }}
          className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 group prism-btn text-sm"
        >
          <span>BUILD YOUR FULL ROADMAP</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}

function FactorCircle({ label, score, color }) {
  const colors = {
    emerald: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    blue: 'text-blue-700 border-blue-200 bg-blue-50',
    indigo: 'text-indigo-700 border-indigo-200 bg-indigo-50',
    amber: 'text-amber-700 border-amber-200 bg-amber-50',
    rose: 'text-rose-700 border-rose-200 bg-rose-50',
    cyan: 'text-cyan-700 border-cyan-200 bg-cyan-50'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-xl mb-3 ${colors[color]}`}>
        {score}
      </div>
      <span className="text-[10px] font-black text-slate-500 text-center uppercase tracking-widest">{label}</span>
    </div>
  );
}
