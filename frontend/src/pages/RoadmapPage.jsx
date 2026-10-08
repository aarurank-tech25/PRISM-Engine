import React, { useEffect, useRef, useState } from 'react';
import '../roadmap/css/prism_roadmap.css';
import { PrismRoadmapModule } from '../roadmap/prism_roadmap_module.js';

export default function RoadmapPage({ careerId, onBack }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let module = null;
    
    const fetchAndInit = async () => {
      try {
        setLoading(true);
        // We fetch dynamic roadmap data for the specific career
        const res = await fetch(`/roadmap/${careerId || 'ai_engineer'}`);
        if (!res.ok) {
          const errText = await res.text();
          console.error(`[Roadmap API Error] URL: /roadmap/${careerId || 'ai_engineer'} | Status: ${res.status} | Body: ${errText} | CareerID: ${careerId}`);
          throw new Error("Unable to load your roadmap. Please try again.");
        }
        const data = await res.json();
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          module = new PrismRoadmapModule(containerRef.current, {
            dataSources: { [careerId || 'ai_engineer']: data },
            initialCareer: careerId || 'ai_engineer'
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndInit();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [careerId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          
        </span>
      </div>

      {loading && <div className="p-8 text-center text-slate-500 animate-pulse">Loading PRISM Roadmap...</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <div 
        ref={containerRef} 
        id="prism-roadmap-container" 
        className={loading || error ? "hidden w-full" : "w-full"}
      />
    </div>

  );
}
