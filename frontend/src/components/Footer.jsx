import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 mt-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm">PRISM Engine</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">v1.2</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Multi-Dimensional STEAM Career Guidance & Hyper-Local Innovation Platform. Integrating Student Aptitude, Financial Constraints, Parent Alignment, and Job Market Demand.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
              PRISM Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>Core AI Engine</li>
              <li>Backend & APIs</li>
              <li>Market Intelligence</li>
              <li>Assessment Engine</li>
              <li>Frontend Dashboard</li>
              <li>Roadmaps & Scholarships</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
              Data Verification
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Synthesized from NASSCOM Tech Talent Study, TeamLease Digital, and India Skills Report (Q1 2026).
            </p>
            <span className="inline-block mt-2 text-[11px] text-slate-400">
              Last updated: 07 Oct 2026
            </span>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs">
          <p>&copy; 2026 PRISM Engine Platform. All rights reserved.</p>
          <p className="mt-1 sm:mt-0 text-[11px]">Designed for high-impact youth STEAM guidance across India.</p>
        </div>
      </div>
    </footer>
  );
}
