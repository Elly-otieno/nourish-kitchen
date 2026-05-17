import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "../services/api";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { 
    mutate: executePasswordReset, 
    isPending: loading, 
    isSuccess: success, 
    error: apiError 
  } = useMutation({
    mutationFn: (payload: { token: string; uid: string; password_new: string }) => 
      api.resetPassword(payload),
    onSuccess: () => {
      // Trigger redirect timing only when mutation completes successfully
      setTimeout(() => navigate("/login"), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Structural runtime fallback validation
    if (!token || !uid) {
      setValidationError("Invalid or expired reset token link.");
      return;
    }

    // Business logic validation
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    // Fire the mutation with the strict interface payload contract
    executePasswordReset({
      token,
      uid,
      password_new: password,
    });
  };

  const currentDisplayError = validationError || (apiError as any)?.message || null;

  if (!token || !uid) {
    return (
      <div className="min-h-screen pt-32 px-6 bg-[#faf9f6]">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8 mx-auto">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h1 className="font-serif text-3xl text-stone-900 mb-4">
            Invalid Link
          </h1>
          <p className="text-stone-500 mb-8 font-light leading-relaxed">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="bg-emerald-950 text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg"
          >
            Request a New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#faf9f6]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <Lock className="text-emerald-950" size={32} strokeWidth={1.5} />
                </div>

                <h1 className="font-serif text-4xl text-emerald-950 text-center mb-4">
                  New Password
                </h1>
                <p className="text-stone-500 text-center mb-10 leading-relaxed font-light">
                  Choose a high-security password to protect your kitchen archives.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 px-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-600 transition-colors"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 pr-14 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 px-1">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-600 transition-colors"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans text-sm"
                      />
                    </div>
                  </div>

                  {currentDisplayError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl text-xs font-bold"
                    >
                      <AlertCircle size={16} />
                      {currentDisplayError}
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-950 text-white py-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <CheckCircle2
                    className="text-emerald-600"
                    size={48}
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="font-serif text-4xl text-emerald-950 mb-6 font-bold leading-tight">
                  Password Updated
                </h2>
                <p className="text-stone-500 mb-10 leading-relaxed font-light italic">
                  Your kitchen archives are secure once again. Redirecting you to login...
                </p>

                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-emerald-600"
                  />
                </div>

                <Link
                  to="/login"
                  className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 border-b-2 border-emerald-950/10 pb-2 hover:border-emerald-950 transition-all"
                >
                  Return to Dashboard Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}