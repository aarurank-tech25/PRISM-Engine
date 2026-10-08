import React, { useState } from "react";
import { Activity, RefreshCw } from "lucide-react";

export default function WhatIfSimulation({ studentId, assessmentId, parentId }) {
  const [overrides, setOverrides] = useState({
    coding: 50,
    maths: 50,
    education_budget: 500000
  });

  const [loading, setLoading] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOverrideChange = (field, value) => {
    setOverrides(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("/analyze/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          assessment_id: assessmentId,
          parent_id: parentId,
          overrides: overrides
        })
      });
      
      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();
      setSimulatedResult(data.ai_result);
    } catch (err) {
      setError("Unable to run simulation. Your saved profile has not been changed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSimulatedResult(null);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-blue-200/80 custom-card-shadow mt-10">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          WHAT IF? (Decision Simulation)
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
          Live Sandbox
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Simulate how boosting your skills or expanding your education budget dynamically impacts your career viability.
        <br/><span className="text-slate-400 font-medium text-xs mt-1 inline-block">Your saved profile will not be modified.</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Coding Skill</label>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">{overrides.coding}/100</span>
          </div>
          <input 
            type="range" min="0" max="100" value={overrides.coding}
            onChange={(e) => handleOverrideChange('coding', e.target.value)}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Maths Academic</label>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">{overrides.maths}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={overrides.maths}
            onChange={(e) => handleOverrideChange('maths', e.target.value)}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Education Budget</label>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">₹{overrides.education_budget.toLocaleString()}</span>
          </div>
          <input 
            type="range" min="50000" max="2500000" step="50000" value={overrides.education_budget}
            onChange={(e) => handleOverrideChange('education_budget', e.target.value)}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleSimulate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 prism-btn"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          Run Simulation
        </button>
        {simulatedResult && (
          <button 
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors border border-slate-200"
          >
            Reset
          </button>
        )}
      </div>

      {error && <div className="mt-4 p-3 rounded-xl bg-red-50 text-sm text-red-600 font-medium border border-red-200">{error}</div>}

      {simulatedResult && (
        <div className="mt-8 border-t border-slate-200 pt-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-extrabold text-slate-900 text-base">Simulation Results</h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">Updated</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulatedResult.ranked_careers.slice(0, 3).map((career, idx) => (
              <div key={idx} className="bg-gradient-to-b from-white to-slate-50/60 border border-emerald-200/80 rounded-2xl p-5 custom-card-shadow custom-card-hover">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Rank #{idx + 1}</div>
                <div className="font-extrabold text-slate-900 text-lg leading-tight mb-2">{career.career_name}</div>
                <div className="text-3xl font-black text-slate-900 mb-2">{Math.round(career.final_score)}%</div>
                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Financial Gap: <span className="font-bold text-slate-700">₹{career.financial_gap?.toLocaleString() || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
