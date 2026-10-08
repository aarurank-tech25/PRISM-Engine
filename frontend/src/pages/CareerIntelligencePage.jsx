import React, { useState, useMemo } from "react";
import { 
  ArrowRight,
  Filter,
  CheckCircle2,
  MapPin,
  TrendingUp,
  RotateCcw,
  Compass,
  Target
} from "lucide-react";
import CareerCard from "../components/CareerCard";
import CareerFilters from "../components/CareerFilters";
import CareerComparison from "../components/CareerComparison";
import PrismMarketInsightWidget from "../components/PrismMarketInsightWidget";

export default function CareerIntelligencePage({
  careersData,
  locationsData,
  onSelectCareer,
  onNavigateRoadmap,
  onNavigateScholarships
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDemand, setSelectedDemand] = useState("all");
  const [sortBy, setSortBy] = useState("demand");
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const careers = careersData?.careers || [];

  const categories = useMemo(() => {
    return Array.from(new Set(careers.map(c => c.category))).sort();
  }, [careers]);

  const cities = useMemo(() => {
    const citySet = new Set();
    careers.forEach(c => {
      c.top_hiring_locations?.forEach(l => citySet.add(l.city));
    });
    return Array.from(citySet).sort();
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter(career => {
      if (search) {
        const q = search.toLowerCase().trim();
        const matchesName = career.career_name.toLowerCase().includes(q);
        const matchesDesc = career.short_description.toLowerCase().includes(q);
        const matchesSkills = career.required_skills.technical.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesSkills) return false;
      }

      if (selectedCategory !== "all" && career.category !== selectedCategory) {
        return false;
      }

      if (selectedCity !== "all") {
        const hasCity = career.top_hiring_locations.some(
          l => l.city.toLowerCase() === selectedCity.toLowerCase() && l.score >= 70
        );
        if (!hasCity) return false;
      }

      if (selectedDemand !== "all") {
        const minVal = parseInt(selectedDemand, 10);
        if (career.market_demand_score < minVal) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "demand") return b.market_demand_score - a.market_demand_score;
      if (sortBy === "growth") return b.future_growth_score - a.future_growth_score;
      if (sortBy === "salary") return (b.salary_range.average_lpa || 0) - (a.salary_range.average_lpa || 0);
      if (sortBy === "name") return a.career_name.localeCompare(b.career_name);
      return 0;
    });
  }, [careers, search, selectedCategory, selectedCity, selectedDemand, sortBy]);

  const toggleCompare = (careerId) => {
    if (compareList.includes(careerId)) {
      setCompareList(prev => prev.filter(id => id !== careerId));
    } else {
      if (compareList.length < 3) {
        setCompareList(prev => [...prev, careerId]);
      }
    }
  };

  const comparedCareerObjects = useMemo(() => {
    return careers.filter(c => compareList.includes(c.career_id));
  }, [careers, compareList]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setSelectedDemand("all");
    setSortBy("demand");
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Editorial Hero Section with subtle mint/blue gradient */}
      <div className="relative rounded-2xl border border-[#E4EAF2] bg-gradient-to-br from-[#F0FDF9] via-[#F8FAFC] to-[#EFF6FF] p-7 sm:p-9 custom-card-shadow overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          
          {/* Hero Left Content */}
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#E8EEFF] text-[#3157D5] border border-[#BFDBFE] uppercase tracking-wider">
                
              </span>
              <span className="text-xs text-[#94A3B8]">•</span>
              <span className="text-xs font-semibold text-[#0F766E] bg-[#E2F7F1] px-2 py-0.5 rounded">
                Verified Q1 2026 Dataset
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
              Career Intelligence
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Explore careers through market demand, salary potential and future growth.
            </p>

            {/* 3 Compact Information Items */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-xs font-medium text-[#172033]">
              <div className="flex items-center space-x-1.5 text-[#16A085]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[#172033]">12 Verified STEAM Careers</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#3157D5]">
                <MapPin className="w-4 h-4 text-[#3157D5]" />
                <span className="text-[#172033]">7 Indian Regional Hubs</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#F59E0B]">
                <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[#172033]">Empirical Salary Ranges</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Clean Editorial SVG Illustration (Career Planning / Target / Growth) */}
          <div className="shrink-0 flex items-center justify-center lg:justify-end">
            <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white/80 rounded-2xl border border-[#E4EAF2] p-4 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid Lines */}
                <circle cx="100" cy="100" r="80" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3"/>
                <circle cx="100" cy="100" r="54" stroke="#E2E8F0" strokeWidth="1.5"/>
                <circle cx="100" cy="100" r="28" stroke="#E2E8F0" strokeWidth="1.5"/>
                
                {/* Target Axis */}
                <line x1="100" y1="12" x2="100" y2="188" stroke="#CBD5E1" strokeWidth="1"/>
                <line x1="12" y1="100" x2="188" y2="100" stroke="#CBD5E1" strokeWidth="1"/>
                
                {/* Growth Trajectory Arc */}
                <path d="M 40 140 Q 90 120 120 80 T 165 42" stroke="#3157D5" strokeWidth="3.5" strokeLinecap="round"/>
                
                {/* Data Points */}
                <circle cx="40" cy="140" r="5" fill="#3157D5"/>
                <circle cx="100" cy="105" r="5" fill="#16A085"/>
                <circle cx="165" cy="42" r="6" fill="#F59E0B"/>
                
                {/* Upward Growth Arrow */}
                <polygon points="163,35 174,42 165,51" fill="#3157D5"/>
                
                {/* Center Target Indicator */}
                <circle cx="100" cy="100" r="4" fill="#3157D5"/>
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* PRISM Insights Section */}
      <PrismMarketInsightWidget 
        career={careers.find(c => c.career_id === "ai-engineer") || careers[0]}
        onExploreRoadmap={onNavigateRoadmap}
        onExploreScholarships={onNavigateScholarships}
      />

      {/* Search & Filter Bar Section */}
      <CareerFilters 
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cities={cities}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedDemand={selectedDemand}
        onDemandChange={setSelectedDemand}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Career Explorer Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              Explore Career Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Compare careers based on real-world market intelligence across India.
            </p>
          </div>

          <div className="text-xs text-[#64748B]">
            Showing <strong className="text-[#172033]">{filteredCareers.length}</strong> careers
          </div>
        </div>

        {/* Careers Card Grid */}
        {filteredCareers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCareers.map((career) => (
              <CareerCard
                key={career.career_id}
                career={career}
                onSelect={onSelectCareer}
                isCompared={compareList.includes(career.career_id)}
                onToggleCompare={toggleCompare}
                compareDisabled={compareList.length >= 3 && !compareList.includes(career.career_id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E4EAF2] p-8 space-y-3 custom-card-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] flex items-center justify-center mx-auto text-[#64748B]">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">
              No careers match your current filters.
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Try removing a filter or exploring all technology careers.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-[#3157D5] hover:bg-[#2644af] text-xs font-semibold text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Comparison Dock */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl bg-white border border-[#CBD5E1] rounded-2xl shadow-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold bg-[#E8EEFF] text-[#3157D5] px-2.5 py-1 rounded-md border border-[#BFDBFE]">
              {compareList.length} of 3
            </span>
            <span className="text-[#64748B] hidden sm:inline font-medium">Selected:</span>
            <div className="flex items-center space-x-1.5 font-medium text-[#172033]">
              {comparedCareerObjects.map(c => (
                <span key={c.career_id} className="bg-[#F8FAFC] border border-[#E4EAF2] px-2 py-0.5 rounded text-[11px] truncate max-w-[120px]">
                  {c.career_name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-[#64748B] hover:text-[#172033] px-2 py-1 font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3157D5] hover:bg-[#2644af] transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <span>Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareOpen && (
        <CareerComparison 
          careers={comparedCareerObjects}
          onClose={() => setIsCompareOpen(false)}
          onSelectCareer={(id) => {
            setIsCompareOpen(false);
            onSelectCareer(id);
          }}
        />
      )}

    </div>
  );
}
