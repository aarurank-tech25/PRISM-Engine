import React, { useState } from "react";
import { fetchWithAuth } from "../api";
import { useAuth } from "../context/AuthContext";
import { User, Users, MapPin, Briefcase, IndianRupee, Shield, Navigation } from "lucide-react";

export default function ProfilePage({ onComplete, onBack }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [student, setStudent] = useState({
    name: currentUser?.displayName || "",
    age: 18,
    grade: "12th Grade",
    location: "Bengaluru",
    interests: ["Technology", "AI & Data"]
  });

  const [parent, setParent] = useState({
    name: currentUser?.displayName ? `${currentUser.displayName}'s Guardian` : "Guardian",
    email: currentUser?.email || "parent@demo.prism",
    phone: "",
    annual_income: 600000,
    education_budget: 200000,
    risk_appetite: "Medium",
    preferred_location: "Bengaluru",
    relocation_preference: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Student
      const studentRes = await fetchWithAuth("/student/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: student.name || "Demo Student",
          age: parseInt(student.age, 10),
          grade: student.grade,
          location: student.location || "India",
          interests: student.interests.length ? student.interests : ["Technology"]
        })
      });

      if (!studentRes.ok) throw new Error("Failed to create student profile.");
      const studentData = await studentRes.json();
      const studentId = studentData._id;

      // 2. Create Parent
      const parentRes = await fetchWithAuth("/parent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          name: parent.name || "Demo Parent",
          email: parent.email || "demo@example.com",
          phone: parent.phone || "",
          annual_income: parseFloat(parent.annual_income),
          education_budget: parseFloat(parent.education_budget),
          risk_appetite: parent.risk_appetite,
          preferred_location: parent.preferred_location || student.location || "India",
          relocation_preference: Boolean(parent.relocation_preference)
        })
      });

      if (!parentRes.ok) {
        const text = await parentRes.text();
        throw new Error(`Failed to create parent profile. Status: ${parentRes.status}. Body: ${text}`);
      }
      const parentData = await parentRes.json();
      const parentId = parentData._id;

      // Ensure persistence/state passing
      onComplete({ studentId, parentId });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <User className="text-blue-600 w-8 h-8" />
          Complete Your Profile
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          Tell us about yourself and your financial constraints so PRISM can tailor recommendations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 custom-card-shadow">
          <h3 className="font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2 text-base">
            <User className="w-5 h-5 text-blue-600" /> Student Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" required value={student.name} onChange={e => setStudent({...student, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" placeholder="e.g. Bala" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Age</label>
              <input type="number" required min="10" max="30" value={student.age} onChange={e => setStudent({...student, age: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Education Level</label>
              <select value={student.grade} onChange={e => setStudent({...student, grade: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all bg-white prism-input">
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
                <option value="Undergraduate">Undergraduate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City/Location</label>
              <input type="text" required value={student.location} onChange={e => setStudent({...student, location: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" placeholder="e.g. Bengaluru" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Interests (Comma separated)</label>
              <input type="text" value={student.interests.join(", ")} onChange={e => setStudent({...student, interests: e.target.value.split(",").map(i => i.trim()).filter(Boolean)})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" placeholder="e.g. Technology, AI & Data, Art" />
            </div>
          </div>
        </div>

        {/* Parent Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 custom-card-shadow">
          <h3 className="font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2 text-base">
            <Users className="w-5 h-5 text-blue-600" /> Parent & Financial Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Parent Name</label>
              <input type="text" required value={parent.name} onChange={e => setParent({...parent, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Contact Email</label>
              <input type="email" required value={parent.email} onChange={e => setParent({...parent, email: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" placeholder="e.g. jane@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5"/> Annual Family Income (INR)</label>
              <input type="number" required min="0" step="10000" value={parent.annual_income} onChange={e => setParent({...parent, annual_income: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5"/> Total Education Budget (INR)</label>
              <input type="number" required min="0" step="10000" value={parent.education_budget} onChange={e => setParent({...parent, education_budget: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all prism-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Shield className="w-3.5 h-3.5"/> Financial Risk Appetite</label>
              <select value={parent.risk_appetite} onChange={e => setParent({...parent, risk_appetite: e.target.value})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all bg-white prism-input">
                <option value="Low">Low (Avoid loans, stick to budget)</option>
                <option value="Medium">Medium (Willing to stretch slightly)</option>
                <option value="High">High (Willing to take education loans)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Navigation className="w-3.5 h-3.5"/> Relocation Preference</label>
              <select value={parent.relocation_preference ? "true" : "false"} onChange={e => setParent({...parent, relocation_preference: e.target.value === "true"})} className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all bg-white prism-input">
                <option value="false">No (Prefer local colleges)</option>
                <option value="true">Yes (Willing to relocate anywhere)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onBack && (
            <button type="button" onClick={onBack} className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm">
              Skip for now
            </button>
          )}
          <button type="submit" disabled={loading} className="px-7 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 text-sm prism-btn">
            {loading ? "Saving Profile..." : "Save Profile & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
