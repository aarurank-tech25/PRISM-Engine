import React, { useState } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  GraduationCap, 
  Award, 
  Building2, 
  TrendingUp, 
  Share2, 
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { getDemandBarColor, getSalaryTierBadge } from "../utils";
import LocationDemand from "../components/LocationDemand";

export default function CareerDetailPage({
  career,
  onBack,
  onNavigateRoadmap,
  onNavigateScholarships
}) {
  const [copied, setCopied] = useState(false);

  if (!career) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Back button & Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-xs prism-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Intelligence</span>
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-xs prism-btn"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{copied ? "Link Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Career Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 custom-card-shadow">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {career.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {career.career_name}
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-500 italic">
            "Understand the market before choosing your pathway."
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {career.short_description}
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Market Demand */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 custom-card-shadow">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Market Demand</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900">{career.market_demand_score}%</span>
            <span className="text-xs text-teal-600 font-bold">({career.market_demand_label})</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${getDemandBarColor(career.market_demand_score)}`}
              style={{ width: `${career.market_demand_score}%` }}
            ></div>
          </div>
        </div>

        {/* Future Growth */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 custom-card-shadow">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Future Growth</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900">{career.future_growth_score}%</span>
            <span className="text-xs text-blue-600 font-bold">{career.future_growth_rate}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-teal-500"
              style={{ width: `${career.future_growth_score}%` }}
            ></div>
          </div>
        </div>

        {/* Salary Potential */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 custom-card-shadow">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Salary Potential</span>
          <div className="mt-1 flex items-baseline">
            <span className={`text-sm font-semibold px-2.5 py-0.5 rounded border ${getSalaryTierBadge(career.salary_potential)}`}>
              {career.salary_potential}
            </span>
          </div>
          <span className="text-xs text-[#64748B] mt-2 block font-medium">
            Avg Mid: {career.salary_range.mid_level}
          </span>
        </div>

        {/* Location Demand */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-4.5 custom-card-shadow">
          <span className="text-xs text-[#64748B] font-medium block">Location Demand</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold text-[#172033]">{career.location_demand_score}%</span>
            <span className="text-xs text-[#64748B]">Hub Index</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#3157D5]"
              style={{ width: `${career.location_demand_score}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-7">
          
          {/* Section A: Market Outlook */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-3 custom-card-shadow">
            <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
              Market Outlook
            </h2>
            <p className="text-sm text-[#172033] leading-relaxed">
              {career.market_outlook}
            </p>
          </div>

          {/* Section B: Salary Intelligence */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-4 custom-card-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
                Salary Intelligence & Career Progression
              </h2>
              <span className="text-xs font-semibold text-[#16A085] bg-[#E2F7F1] px-2.5 py-1 rounded-md">
                National Avg: ?{career.salary_range.average_lpa} LPA
              </span>
            </div>

            <div className="space-y-3">
              {career.experience_progression.map((tier, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-[#E4EAF2] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-xs text-[#172033]">{tier.level}</span>
                    <p className="text-xs text-[#64748B] mt-0.5">{tier.focus}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-sm font-bold text-[#172033]">{tier.range}</span>
                    <span className="text-[10px] text-[#94A3B8] block">Annual CTC</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Geographic Demand Across Cities */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-4 custom-card-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
                Geographic Demand Across Cities
              </h2>
              <span className="text-xs text-[#64748B] font-medium">7 Regional Tech Corridors</span>
            </div>

            <LocationDemand locations={career.top_hiring_locations} />
          </div>

          {/* Section D: Required Skills */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-4 custom-card-shadow">
            <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
              Required Skills & Competencies
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#64748B] block mb-2">
                  Technical & Engineering Competencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {career.required_skills.technical.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-lg bg-[#E8EEFF] border border-[#BFDBFE] text-xs font-semibold text-[#3157D5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#64748B] block mb-2">
                  Cognitive & Professional Soft Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {career.required_skills.soft_skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-lg bg-[#F8FAFC] border border-[#E4EAF2] text-xs font-medium text-[#172033]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          
          {/* PRISM Pathway Actions */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-4 custom-card-shadow">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              PRISM Pathway Actions
            </h3>
            
            <p className="text-xs text-[#64748B] leading-relaxed">
              Connect this career intelligence directly into your education roadmap and scholarship opportunities:
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => onNavigateRoadmap(career.career_id)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#3157D5] hover:bg-[#2644af] flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Explore Education Pathway</span>
                </div>
                <span>?</span>
              </button>

              <button
                onClick={() => onNavigateScholarships(career.career_id)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#0F766E] bg-[#E2F7F1] hover:bg-[#cbf1e7] border border-[#A7F3D0] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>View Scholarships</span>
                </div>
                <span>?</span>
              </button>
            </div>
          </div>

          {/* Hiring Industries */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-3 custom-card-shadow">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#94A3B8]" />
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Industries Hiring
              </h3>
            </div>
            <div className="space-y-1.5">
              {career.industry_sectors.map((sector, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 text-xs font-medium text-[#172033] p-2.5 rounded-lg bg-[#F8FAFC]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3157D5] shrink-0" />
                  <span>{sector}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-3 custom-card-shadow text-xs">
            <h3 className="font-bold text-[#172033] uppercase tracking-wider text-xs">
              Data Sources
            </h3>
            <div className="text-[#64748B] space-y-2">
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Primary Source:</span>
                <span className="font-semibold text-[#172033]">{career.data_source}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Last Updated:</span>
                <span className="font-medium text-[#172033]">{career.last_updated}</span>
              </div>
              <div className="pt-2 border-t border-[#E4EAF2]">
                <span className="inline-block px-2 py-0.5 rounded bg-[#E2F7F1] text-[#0F766E] text-[10px] font-bold border border-[#A7F3D0]">
                  Public Market Intelligence Dataset
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
