import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { Brain, Mail, Smartphone, ArrowRight, CheckCircle2, ChevronLeft, ShieldCheck } from "lucide-react";

const FIREBASE_CONFIGURED = !!auth;

export default function Login({ onBack }) {
  const { loginDemo, loginWithGoogle, loginWithEmail, registerWithEmail, setupRecaptcha, sendPhoneOTP } = useAuth();
  
  const [method, setMethod] = useState("select"); // select, email, phone
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [error, setError] = useState("");
  const [demoName, setDemoName] = useState("");
  const [demoPassword, setDemoPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!demoName.trim() || !demoPassword.trim()) {
      setError("Please enter both Name and Password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await loginDemo(demoName.trim(), demoPassword.trim());
    } catch (err) {
      setError(err.message || "Failed to enter demo session.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
    } catch (e) {
      setError("Failed to sign in with Google: " + e.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      if (isSignUp) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (e) {
      setError("Authentication failed: " + e.message);
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const appVerifier = setupRecaptcha('recaptcha-container');
      const confirmation = await sendPhoneOTP(phone, appVerifier);
      setConfirmationResult(confirmation);
      setLoading(false);
    } catch (e) {
      setError("Failed to send OTP: " + e.message);
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await confirmationResult.confirm(otp);
    } catch (e) {
      setError("Invalid OTP: " + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to landing */}
      {onBack && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-3 px-4 sm:px-0">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to PRISM
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4 sm:px-0">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white mb-5 shadow-lg shadow-blue-500/25">
          <Brain className="w-7 h-7" />
        </div>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          {FIREBASE_CONFIGURED ? "Sign in to PRISM" : "PRISM"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {FIREBASE_CONFIGURED ? "Your personalized career intelligence starts here." : "Enter your details to continue"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">

          {/* Simple Demo Login — active when Firebase is not configured */}
          {!FIREBASE_CONFIGURED && (
            <div>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200/80">
                  {error}
                </div>
              )}

              <form onSubmit={handleDemoSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bala"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-900 prism-input transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={demoPassword}
                    onChange={(e) => setDemoPassword(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-slate-900 prism-input transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all uppercase tracking-wider prism-btn"
                >
                  {loading ? "Entering..." : "ENTER PRISM"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Normal login form — only shown when Firebase IS configured */}
          {FIREBASE_CONFIGURED && (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              {method === "select" && (
                <div className="space-y-4">
                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMethod("email")}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-slate-400" />
                    Email &amp; Password
                  </button>

                  <button
                    onClick={() => setMethod("phone")}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    Phone Number
                  </button>
                </div>
              )}

              {method === "email" && (
                <form onSubmit={handleEmailAuth} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm font-medium"
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {loading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-center mt-4">
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm font-bold text-blue-600 hover:text-blue-500">
                      {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <button type="button" onClick={() => setMethod("select")} className="text-xs font-medium text-slate-400 hover:text-slate-600">Back</button>
                  </div>
                </form>
              )}

              {method === "phone" && (
                <div className="space-y-5">
                  {!confirmationResult ? (
                    <form onSubmit={handleSendOTP} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number (with country code)</label>
                        <input type="tel" required placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm font-medium"
                        />
                      </div>
                      <div id="recaptcha-container"></div>
                      <button type="submit" disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Enter OTP</label>
                        <input type="text" required placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 text-center tracking-widest text-lg font-black text-slate-800 placeholder-slate-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                      >
                        {loading ? "Verifying..." : "Verify & Sign In"}
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </form>
                  )}
                  <div className="text-center mt-4">
                    <button type="button" onClick={() => { setMethod("select"); setConfirmationResult(null); }} className="text-xs font-medium text-slate-400 hover:text-slate-600">Back</button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
