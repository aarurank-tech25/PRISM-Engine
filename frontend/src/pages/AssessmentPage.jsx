import React, { useState } from "react";
import { fetchWithAuth } from "../api";

export default function AssessmentPage({ studentContext, onComplete, onBack }) {
  const [formData, setFormData] = useState({
    maths: 80,
    science: 80,
    english: 80,
    coding: 50,
    communication: 50,
    problem_solving: 50,
    career_preference: "ai_engineer"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "career_preference" ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const actualStudentId = studentContext?.studentId || "demo";
      const actualParentId = studentContext?.parentId || null;

      // 1. Submit Assessment to Backend
      const assessmentPayload = {
        student_id: actualStudentId,
        academic_scores: {
          maths: formData.maths,
          science: formData.science,
          english: formData.english
        },
        skills: {
          coding: formData.coding,
          communication: formData.communication,
          problem_solving: formData.problem_solving
        },
        career_preferences: [formData.career_preference]
      };
      
      const res = await fetchWithAuth("/assessment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentPayload)
      });
      
      if (!res.ok) {
        throw new Error("Failed to submit assessment to the server.");
      }
      
      const data = await res.json();
      const assessmentId = data._id;
      
      if (!assessmentId) {
        throw new Error("Invalid response from server: Missing assessment ID");
      }
      
      // 2. Trigger AI Analysis
      const analyzeRes = await fetchWithAuth("/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: actualStudentId,
          assessment_id: assessmentId,
          parent_id: actualParentId
        })
      });
      
      if (!analyzeRes.ok) {
        throw new Error("Analysis failed. Please try again.");
      }
      
      const analyzeData = await analyzeRes.json();
      
      // 3. Complete and pass AI result back to App.jsx
      onComplete(analyzeData.ai_result);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Assessment Engine</h2>
          <p className="text-slate-500 mt-1">Complete your profile for personalized PRISM AI analysis</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 custom-card-shadow">
        
        {/* Section 1: Academics */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5">Academic Performance (%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mathematics</label>
              <input type="number" name="maths" min="0" max="100" required value={formData.maths} onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Science</label>
              <input type="number" name="science" min="0" max="100" required value={formData.science} onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">English</label>
              <input type="number" name="english" min="0" max="100" required value={formData.english} onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" />
            </div>
          </div>
        </div>

        {/* Section 2: Skills */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5">Core Skills (0–100)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Coding / Logic</label>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{formData.coding}</span>
              </div>
              <input type="range" name="coding" min="0" max="100" value={formData.coding} onChange={handleChange} className="w-full accent-blue-600 cursor-pointer" />
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Communication</label>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{formData.communication}</span>
              </div>
              <input type="range" name="communication" min="0" max="100" value={formData.communication} onChange={handleChange} className="w-full accent-blue-600 cursor-pointer" />
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Problem Solving</label>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{formData.problem_solving}</span>
              </div>
              <input type="range" name="problem_solving" min="0" max="100" value={formData.problem_solving} onChange={handleChange} className="w-full accent-blue-600 cursor-pointer" />
            </div>
          </div>
        </div>
        
        {/* Section 3: Preferences */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5">Career Preferences</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Primary Career Focus</label>
            <select name="career_preference" value={formData.career_preference} onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all bg-white prism-input">
              <option value="ai_engineer">AI Engineer</option>
              <option value="data_scientist">Data Scientist</option>
              <option value="robotics_engineer">Robotics Engineer</option>
              <option value="cybersecurity">Cybersecurity Analyst</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center px-7 py-3 text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all prism-btn"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Profile...
              </>
            ) : "Submit & Run PRISM Analysis"}
          </button>
        </div>
        
      </form>
    </div>
  );
}
