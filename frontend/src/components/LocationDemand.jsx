import React from "react";
import { MapPin } from "lucide-react";
import { getDemandBarColor } from "../utils";

export default function LocationDemand({ locations = [] }) {
  const getBadgeStyle = (score) => {
    if (score >= 90) return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (score >= 80) return "bg-blue-50 text-blue-800 border-blue-200";
    if (score >= 70) return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-2.5">
      {locations.map((loc, idx) => (
        <div 
          key={idx}
          className="rounded-lg border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-sm text-slate-900">{loc.city}</span>
            </div>
            
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getBadgeStyle(loc.score)}`}>
              {loc.demand_level} ({loc.score}%)
            </span>
          </div>

          {/* Simple Clean Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full ${getDemandBarColor(loc.score)}`}
              style={{ width: `${loc.score}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-700 font-medium">Hiring Focus:</strong> {loc.ecosystem_notes}
          </p>
        </div>
      ))}
    </div>
  );
}
