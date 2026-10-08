import React, { useState } from "react";
import { Brain, ArrowRight, ShieldCheck, ListPlus, Check, X, Sparkles, AlertCircle } from "lucide-react";
import CareerExplanation from "../components/CareerExplanation";
import WhatIfSimulation from "../components/WhatIfSimulation";

export default function RecommendationsPage({ aiResult, studentContext, marketCareers, onSelectCareer }) {
  const [showComparison, setShowComparison] = useState(false);

  if (!aiResult || !aiResult.ranked_careers) return null;

  const careerList = aiResult.ranked_careers.map((fitData) => {
    const matchStr = fitData.career_name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const marketData = marketCareers.find(c => 
      c.career_name === fitData.career_name || 
      c.career_id === matchStr ||
      c.career_id === fitData.career_id
    );
    const careerId = marketData?.career_id || matchStr;
    return { id: careerId, fitData, marketData };
  });

  const topCareer = careerList[0];
  const alternatives = careerList.slice(1, 4);
  const topScore = aiResult.summary?.top_score || topCareer.fitData.final_score || 0;

  // Feature 3: Dynamic Factor Differential Analysis for "Why NOT Other Careers?"
  const getWhyLowerDetails = (altCareer) => {
    const topFit = topCareer.fitData;
    const altFit = altCareer.fitData;
    const differentials = [];

    const skillTop = Math.round(topFit.skill_match ?? (topFit.student_fit ? Math.max(0, topFit.student_fit - 5) : 70));
    const skillAlt = Math.round(altFit.skill_match ?? (altFit.student_fit ? Math.max(0, altFit.student_fit - 5) : 70));
    const skillDiff = skillTop - skillAlt;
    if (skillDiff > 2) {
      differentials.push({
        factor: "Skill Readiness",
        delta: `-${skillDiff}%`,
        reason: `Current technical readiness is lower than for ${topFit.career_name}.`
      });
    }

    const acadTop = Math.round(topFit.student_fit ?? 0);
    const acadAlt = Math.round(altFit.student_fit ?? 0);
    const acadDiff = acadTop - acadAlt;
    if (acadDiff > 2) {
      differentials.push({
        factor: "Academic Fit",
        delta: `-${acadDiff}%`,
        reason: `Coursework and prerequisite alignment is ${acadDiff}% lower.`
      });
    }

    const finTop = Math.round(topFit.financial_fit ?? 100);
    const finAlt = Math.round(altFit.financial_fit ?? 100);
    const finDiff = finTop - finAlt;
    if (finDiff > 5 || (altFit.financial_gap && altFit.financial_gap > 0)) {
      differentials.push({
        factor: "Financial Fit",
        delta: altFit.financial_gap > 0 ? `Gap: ₹${(altFit.financial_gap / 1000).toFixed(0)}k` : `-${finDiff}%`,
        reason: altFit.financial_gap > 0 
          ? `Carries an estimated tuition gap of ₹${altFit.financial_gap.toLocaleString()}.`
          : `Higher financial cost creates greater budget friction.`
      });
    }

    const mktTop = Math.round(topFit.market_fit ?? 80);
    const mktAlt = Math.round(altFit.market_fit ?? 80);
    const mktDiff = mktTop - mktAlt;
    if (mktDiff > 3) {
      differentials.push({
        factor: "Market Demand",
        delta: `-${mktDiff}%`,
        reason: `Hiring demand signal is comparatively softer.`
      });
    }

    if (differentials.length === 0) {
      differentials.push({
        factor: "Composite Score",
        delta: `-${Math.max(1, Math.round(topCareer.fitData.final_score - altCareer.fitData.final_score))}%`,
        reason: `Ranks lower across combined weighted PRISM multi-dimensional optimization.`
      });
    }

    return differentials.slice(0, 3);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 border-b border-slate-200 pb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          PRISM Career Intelligence
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          The PRISM engine has evaluated your profile. Here is your optimal pathway and the data driving the decision.
        </p>

        {/* Feature 11: Signature PRISM Message Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 max-w-2xl mx-auto text-blue-950 flex items-center gap-3 text-left">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 block mb-0.5">PRISM Positioning</span>
            <p className="text-xs sm:text-sm font-semibold">
              &ldquo;PRISM doesn&apos;t just recommend a career. It determines how realistically a student can reach it.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* TOP RECOMMENDED CAREER (DASHBOARD) */}
      <div className="mb-16">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-4 h-[1px] bg-slate-300"></span> Your Optimal Match <span className="w-4 h-[1px] bg-slate-300"></span>
        </h3>
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(37,99,235,0.15)] border border-blue-100 overflow-hidden transition-all hover:shadow-[0_10px_40px_-15px_rgba(37,99,235,0.25)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-white text-blue-800 font-black px-3 py-1 rounded-md text-xs tracking-widest uppercase shadow-sm">
                    #1 RANKED
                  </span>
                  <span className="bg-blue-800/50 text-blue-50 px-3 py-1 rounded-md text-xs font-bold border border-blue-400/30 backdrop-blur-sm">
                    {Math.round(topScore)}% Optimal Match
                  </span>
                </div>
                <h4 className="text-4xl sm:text-5xl font-black tracking-tight">{topCareer.fitData.career_name}</h4>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <CareerExplanation 
              fitData={topCareer.fitData} 
              marketData={topCareer.marketData} 
              onExploreRoadmap={() => onSelectCareer(topCareer.id)} 
            />
            
            {studentContext && studentContext.studentId && (
              <div className="mt-12 border-t border-slate-200 pt-12">
                <WhatIfSimulation 
                  studentId={studentContext.studentId}
                  assessmentId={aiResult.assessment_id || null}
                  parentId={studentContext.parentId || null}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALTERNATIVES */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-[1px] bg-slate-300"></span> Top Alternatives <span className="w-4 h-[1px] bg-slate-300"></span>
          </h3>
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="text-xs font-black tracking-widest uppercase text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2 transition-colors border border-blue-200"
          >
            <ListPlus className="w-4 h-4" /> {showComparison ? "Hide Comparison" : "Compare Options"}
          </button>
        </div>

        {showComparison && (
          <div className="mb-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-4 font-black text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200">Career</th>
                  <th className="p-4 font-black text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200">Match</th>
                  <th className="p-4 font-black text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200">Demand</th>
                  <th className="p-4 font-black text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200">Interest</th>
                  <th className="p-4 font-black text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200">Skill</th>
                  <th className="p-4 font-black text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200">Finance</th>
                </tr>
              </thead>
              <tbody>
                {careerList.slice(0, 4).map((c, i) => (
                  <tr key={i} className={`border-b last:border-0 ${i === 0 ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      {i === 0 ? <Check className="w-4 h-4 text-blue-600" /> : <span className="w-4 h-4 inline-block text-slate-300 font-black text-xs">{i+1}</span>}
                      {c.fitData.career_name}
                    </td>
                    <td className="p-4 font-black text-slate-800">{Math.round(c.fitData.student_fit)}%</td>
                    <td className="p-4 font-bold text-emerald-700">{c.marketData?.market_demand_label || "High"}</td>
                    <td className="p-4 font-medium text-slate-700">{Math.round(c.fitData.preference_match || c.fitData.interest_match || 80)}%</td>
                    <td className="p-4 font-medium text-slate-700">{Math.round(c.fitData.skill_match || c.fitData.student_fit - 5)}%</td>
                    <td className="p-4 font-medium text-slate-700">{Math.round(c.fitData.financial_fit)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 p-4 bg-blue-50 text-blue-900 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
              <Brain className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
              <div>
                <span className="font-black uppercase tracking-wider text-xs block mb-1 text-blue-700">Why {topCareer.fitData.career_name} Won:</span> 
                It optimally balances a {Math.round(topCareer.fitData.student_fit)}% academic fit with {topCareer.marketData?.market_demand_label?.toLowerCase() || 'high'} market demand, outscoring alternatives across combined constraints.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alternatives.map((alt, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectCareer(alt.id)}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col h-full group"
            >
              <div className="flex justify-between items-center mb-5">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-black flex items-center justify-center text-xs">#{idx + 2}</span>
                <span className="font-black text-xl text-slate-800">{Math.round(alt.fitData.final_score)}%</span>
              </div>
              
              <h4 className="font-black text-slate-900 text-xl leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                {alt.fitData.career_name}
              </h4>
              
              <div className="flex-grow mb-6">
                <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>WHY THIS RANKS LOWER</span>
                </div>
                
                <div className="space-y-2">
                  {getWhyLowerDetails(alt).map((diff, dIdx) => (
                    <div key={dIdx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-bold text-slate-800">{diff.factor}</span>
                        <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                          {diff.delta}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">{diff.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Explore Alternative</span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
