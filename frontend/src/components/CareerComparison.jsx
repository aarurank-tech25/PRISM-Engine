import React from "react";
import { 
  X, 
  ArrowRight, 
  MapPin, 
  CheckCircle2 
} from "lucide-react";
import { getDemandBarColor, getSalaryTierBadge } from "../utils";

export default function CareerComparison({ careers = [], onClose, onSelectCareer }) {
  if (!careers || careers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              Career Comparison
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Compare Selected Careers ({careers.length} of 3)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side analysis of demand, compensation, growth, and regional hubs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Comparison Matrix Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-semibold text-slate-500 uppercase tracking-wider w-1/4">
                  Parameter
                </th>
                {careers.map((career) => (
                  <th key={career.career_id} className="py-3 px-4 font-bold text-slate-900 text-sm">
                    <div>{career.career_name}</div>
                    <div className="text-[11px] font-normal text-slate-500">{career.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Market Demand */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Market Demand</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <span className="text-sm font-bold text-slate-900">{c.market_demand_score}%</span>
                    <span className="text-[11px] text-slate-500 ml-1">({c.market_demand_label})</span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${getDemandBarColor(c.market_demand_score)}`} style={{ width: `${c.market_demand_score}%` }}></div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Future Growth */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Future Growth</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <span className="text-sm font-bold text-blue-700">{c.future_growth_score}%</span>
                    <span className="text-[11px] text-slate-500 block">{c.future_growth_rate}</span>
                  </td>
                ))}
              </tr>

              {/* Salary Potential */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Salary Potential</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getSalaryTierBadge(c.salary_potential)}`}>
                      {c.salary_potential}
                    </span>
                    <span className="text-xs text-slate-700 font-semibold block mt-1">
                      Mid: {c.salary_range.mid_level}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Industry Growth */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Industry Growth</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <span className="text-sm font-bold text-slate-900">{c.industry_growth_score}%</span>
                  </td>
                ))}
              </tr>

              {/* Location Demand */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Location Fit Index</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <span className="text-sm font-bold text-slate-900">{c.location_demand_score}%</span>
                  </td>
                ))}
              </tr>

              {/* Top Cities */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Top Regional Hubs</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.top_hiring_locations.slice(0, 3).map((l, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {l.city} ({l.score}%)
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Required Skills */}
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-600 bg-slate-50/50">Key Skills</td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.required_skills.technical.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* View Action Row */}
              <tr>
                <td className="py-4 px-4 bg-slate-50/50"></td>
                {careers.map((c) => (
                  <td key={c.career_id} className="py-4 px-4">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCareer(c.career_id);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                    >
                      <span>View Career Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
