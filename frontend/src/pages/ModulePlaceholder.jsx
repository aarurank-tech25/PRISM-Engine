import React from "react";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";

export default function ModulePlaceholder({ title, route, onBack }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto">
        <Clock className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
          Route: {route}
        </span>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          This module is currently under active development.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white border border-slate-200 max-w-md mx-auto text-xs text-slate-600 text-left space-y-2 shadow-xs">
        <div className="flex items-center space-x-2 text-blue-700 font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>PRISM Platform Integration</span>
        </div>
        <p>
          The <strong>Career Intelligence Engine</strong> provides the market demand scores, location fit indices, and industry growth vectors to this module.
        </p>
      </div>

      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Intelligence</span>
        </button>
      </div>
    </div>
  );
}
