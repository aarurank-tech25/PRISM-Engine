import React from "react";
import { 
  ArrowUpRight, 
  MapPin, 
  Plus, 
  Check 
} from "lucide-react";
import { getDemandBarColor, getSalaryTierBadge } from "../utils";

export default function CareerCard({
  career,
  onSelect,
  isCompared,
  onToggleCompare,
  compareDisabled
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 custom-card-hover p-5 flex flex-col justify-between custom-card-shadow">
      
      <div>
        {/* Category & Compare Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {career.category}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(career.career_id);
            }}
            disabled={!isCompared && compareDisabled}
            className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              isCompared
                ? "bg-blue-50 text-blue-600 border-blue-200 font-bold"
                : compareDisabled
                ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-white"
            }`}
          >
            {isCompared ? (
              <>
                <Check className="w-3 h-3 text-blue-600" />
                <span className="text-[11px]">Selected</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 text-slate-400" />
                <span className="text-[11px]">Compare</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(career.career_id)}
          className="text-lg font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-between"
        >
          <span>{career.career_name}</span>
          <ArrowUpRight className="w-4 h-4 text-slate-400 hover:text-blue-600" />
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs text-[#64748B] leading-relaxed line-clamp-2">
          {career.short_description}
        </p>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E4EAF2]">
          <div>
            <span className="text-[10px] text-[#64748B] block font-medium">Market Demand</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-sm font-bold text-[#172033]">{career.market_demand_score}%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${getDemandBarColor(career.market_demand_score)}`}
                style={{ width: `${career.market_demand_score}%` }}
              ></div>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block font-medium">Future Growth</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-sm font-bold text-[#172033]">{career.future_growth_score}%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full rounded-full bg-[#16A085]"
                style={{ width: `${career.future_growth_score}%` }}
              ></div>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block font-medium">Salary Potential</span>
            <div className="mt-1">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getSalaryTierBadge(career.salary_potential)}`}>
                {career.salary_potential}
              </span>
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="mt-3.5 flex items-center space-x-1.5 text-xs text-[#64748B]">
          <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
          <span className="text-[11px] text-[#64748B] font-medium">Top Hubs:</span>
          <span className="text-[11px] text-[#172033] font-medium truncate">
            {career.top_hiring_locations.slice(0, 3).map(l => l.city).join(" · ")}
          </span>
        </div>

        {/* 3 Required Skills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {career.required_skills.technical.slice(0, 3).map((skill, idx) => (
            <span 
              key={idx}
              className="text-[11px] font-medium text-[#172033] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
          {career.required_skills.technical.length > 3 && (
            <span className="text-[10px] text-[#94A3B8] self-center">
              +{career.required_skills.technical.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-5 pt-3.5 border-t border-[#E4EAF2] flex items-center justify-between">
        <span className="text-xs text-[#64748B]">
          Mid CTC: <strong className="text-[#172033]">{career.salary_range.mid_level}</strong>
        </span>

        <button
          onClick={() => onSelect(career.career_id)}
          className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3157D5] hover:bg-[#2644af] transition-colors shadow-xs"
        >
          <span>View Career</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
