import React from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function CareerFilters({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  cities,
  selectedCity,
  onCityChange,
  selectedDemand,
  onDemandChange,
  sortBy,
  onSortChange,
  onReset
}) {
  const hasActiveFilters = Boolean(
    search || 
    selectedCategory !== "all" || 
    selectedCity !== "all" || 
    selectedDemand !== "all"
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E4EAF2] p-4.5 sm:p-5 custom-card-shadow space-y-4">
      
      {/* Top Search Input & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Large search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search careers, skills, or domains (e.g. Python, ROS, BMS, AI)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2] text-sm text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:border-[#3157D5] focus:bg-white transition-colors"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-[#64748B] font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white border border-[#E4EAF2] text-xs font-semibold text-[#172033] focus:outline-none focus:border-[#3157D5] transition-colors"
          >
            <option value="demand">Market Demand</option>
            <option value="growth">Future Growth</option>
            <option value="salary">Salary Potential</option>
            <option value="name">Career Name</option>
          </select>
        </div>

        {/* Filter button indicator / Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] text-xs font-medium text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E4EAF2]">
        
        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-[#64748B] block mb-1">
            Career Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2] text-xs text-[#172033] font-medium focus:outline-none focus:border-[#3157D5] focus:bg-white transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold text-[#64748B] block mb-1">
            All Locations
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2] text-xs text-[#172033] font-medium focus:outline-none focus:border-[#3157D5] focus:bg-white transition-colors"
          >
            <option value="all">All Locations</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Demand */}
        <div>
          <label className="text-xs font-semibold text-[#64748B] block mb-1">
            Market Demand
          </label>
          <select
            value={selectedDemand}
            onChange={(e) => onDemandChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E4EAF2] text-xs text-[#172033] font-medium focus:outline-none focus:border-[#3157D5] focus:bg-white transition-colors"
          >
            <option value="all">Any Demand</option>
            <option value="90">Very High (90%+)</option>
            <option value="80">High (80%+)</option>
            <option value="75">Moderate (75%+)</option>
          </select>
        </div>

      </div>

    </div>
  );
}
