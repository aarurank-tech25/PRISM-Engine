import React from "react";
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  User 
} from "lucide-react";
import { getDemandBarColor } from "../utils";

export default function PrismMarketInsightWidget({ career, onExploreRoadmap, onExploreScholarships }) {
  if (!career) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 sm:p-7 custom-card-shadow space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4EAF2]">
        <div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#E8EEFF] text-[#3157D5] uppercase tracking-wider">
            PRISM Recommendation Engine Insights
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] mt-2">
            Why {career.career_name} has strong market potential
          </h2>
          <p className="text-sm text-[#64748B] mt-1 leading-relaxed max-w-2xl">
            {career.short_description} AI engineering continues to see strong demand across technology, finance, healthcare, and enterprise software.
          </p>
        </div>

        {/* Right Author Badge */}
        <div className="flex items-center space-x-2.5 bg-[#F8FAFC] border border-[#E4EAF2] px-3.5 py-2 rounded-xl shrink-0 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-full bg-[#E8EEFF] text-[#3157D5] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#64748B]">Module Lead</div>
            <div className="text-xs font-bold text-[#172033]">Student</div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1 - Market Demand */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-4.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Market Demand</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8EEFF] text-[#3157D5] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033]">
            {career.market_demand_score}%
          </div>
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-[#3157D5] rounded-full"
              style={{ width: `${career.market_demand_score}%` }}
            ></div>
          </div>
        </div>

        {/* CARD 2 - Future Growth */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-4.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Future Growth</span>
            <div className="w-7 h-7 rounded-lg bg-[#E2F7F1] text-[#16A085] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033]">
            {career.future_growth_score}%
          </div>
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-[#16A085] rounded-full"
              style={{ width: `${career.future_growth_score}%` }}
            ></div>
          </div>
        </div>

        {/* CARD 3 - Salary Potential */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-4.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Salary Potential</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF4D8] text-[#F59E0B] flex items-center justify-center font-bold text-xs">
              ?
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033]">
            {career.salary_potential}
          </div>
          <div className="text-[11px] text-[#64748B] mt-2 font-medium">
            Avg Mid: {career.salary_range.mid_level}
          </div>
        </div>

        {/* CARD 4 - Top Regional Hubs */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-4.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#64748B]">Top Regional Hubs</span>
            <div className="w-7 h-7 rounded-lg bg-[#F1EAFF] text-[#8B5CF6] flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm font-bold text-[#172033] mt-1 leading-snug">
            Chennai • Bengaluru
          </div>
          <div className="text-[11px] text-[#64748B] mt-1 truncate">
            + Hyderabad · Pune · NCR
          </div>
        </div>

      </div>

      {/* Integration Handoff */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[#64748B]">
          PRISM Scoring Weights: <strong className="text-[#172033]">25% Market Fit + 10% Location Fit + 10% Future Growth</strong>
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExploreRoadmap(career.career_id)}
            className="px-3.5 py-2 rounded-lg font-semibold text-[#3157D5] bg-[#E8EEFF] hover:bg-[#dbe4ff] transition-colors"
          >
            Explore Education Pathway ?
          </button>
          <button
            onClick={() => onExploreScholarships(career.career_id)}
            className="px-3.5 py-2 rounded-lg font-semibold text-[#0F766E] bg-[#E2F7F1] hover:bg-[#cbf1e7] transition-colors"
          >
            View Scholarships ?
          </button>
        </div>
      </div>

    </div>
  );
}
