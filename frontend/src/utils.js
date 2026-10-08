export const getDemandBadgeColor = (score) => {
  if (score >= 90) return "bg-[#E2F7F1] text-[#0F766E] border-[#A7F3D0]";
  if (score >= 80) return "bg-[#E8EEFF] text-[#3157D5] border-[#BFDBFE]";
  if (score >= 70) return "bg-[#FFF4D8] text-[#B45309] border-[#FDE68A]";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export const getDemandBarColor = (score) => {
  if (score >= 90) return "bg-[#16A085]";
  if (score >= 80) return "bg-[#3157D5]";
  if (score >= 70) return "bg-[#F59E0B]";
  return "bg-slate-500";
};

export const getSalaryTierBadge = (tier) => {
  if (tier?.toLowerCase().includes("very high")) {
    return "bg-[#F1EAFF] text-[#7C3AED] border-[#DDD6FE]";
  }
  if (tier?.toLowerCase().includes("high")) {
    return "bg-[#FFF4D8] text-[#B45309] border-[#FDE68A]";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export const formatCurrency = (val) => {
  return typeof val === "number" ? `₹${val} LPA` : val;
};
