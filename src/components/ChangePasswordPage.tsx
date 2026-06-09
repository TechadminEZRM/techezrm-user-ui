"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Shield, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

interface ChangePasswordPageProps {
  onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ onPasswordChange }) => {
  const [formData, setFormData] = useState<PasswordForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (apiError) setApiError("");
    if (success) setSuccess(false);
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, message: "", color: "var(--color-line-light)" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    switch (score) {
      case 0: case 1: return { score, message: "Very Weak", color: "#f44336" };
      case 2: return { score, message: "Weak", color: "#ff9800" };
      case 3: return { score, message: "Fair", color: "#ffc107" };
      case 4: return { score, message: "Good", color: "#8bc34a" };
      case 5: return { score, message: "Strong", color: "var(--color-success)" };
      default: return { score: 0, message: "", color: "var(--color-line-light)" };
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.currentPassword.trim()) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword.trim()) newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters long";
    else if (formData.newPassword === formData.currentPassword) newErrors.newPassword = "New password must be different from current password";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your new password";
    else if (formData.confirmPassword !== formData.newPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError("");
    try {
      if (onPasswordChange) await onPasswordChange(formData.currentPassword, formData.newPassword);
      setSuccess(true);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      setApiError(error?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordRequirements = [
    { met: formData.newPassword.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(formData.newPassword), text: "One lowercase letter" },
    { met: /[A-Z]/.test(formData.newPassword), text: "One uppercase letter" },
    { met: /[0-9]/.test(formData.newPassword), text: "One number" },
    { met: /[^A-Za-z0-9]/.test(formData.newPassword), text: "One special character" },
  ];

  const inputClass = "flex h-10 w-full rounded-xl border border-line-light bg-white pr-10 pl-4 py-2 text-sm text-heading placeholder:text-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand";

  return (
    <div className="max-w-[600px] mx-auto p-6">
      {success && (
        <Alert variant="success" className="mb-6">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Password changed successfully! Please use your new password for future logins.</div>
        </Alert>
      )}
      {apiError && <Alert variant="destructive" className="mb-6">{apiError}</Alert>}

      <Card className="rounded-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 font-semibold text-lg mb-6">
            <Lock className="w-5 h-5 text-brand" />
            Password Update
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Current Password */}
              <div>
                <label className="text-sm text-heading mb-1.5 block font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Current password"
                  />
                  <button type="button" onClick={() => togglePasswordVisibility("current")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
              </div>

              <hr className="border-line" />

              {/* New Password */}
              <div>
                <label className="text-sm text-heading mb-1.5 block font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    required
                    className={inputClass}
                    placeholder="New password"
                  />
                  <button type="button" onClick={() => togglePasswordVisibility("new")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>

              {/* Password Strength */}
              {formData.newPassword && (
                <div className="-mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-dim">Password Strength:</span>
                    <span className="text-sm font-semibold" style={{ color: passwordStrength.color }}>{passwordStrength.message}</span>
                  </div>
                  <div className="w-full h-1 bg-line-light rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(passwordStrength.score / 5) * 100}%`, backgroundColor: passwordStrength.color }} />
                  </div>
                </div>
              )}

              {/* Requirements */}
              {formData.newPassword && (
                <div>
                  <p className="text-sm text-dim mb-2">Password Requirements:</p>
                  <div className="flex flex-col gap-1">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: req.met ? "var(--color-success)" : "var(--color-line-light)" }} />
                        <span className="text-sm" style={{ color: req.met ? "var(--color-success)" : "var(--color-faint)" }}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="text-sm text-heading mb-1.5 block font-medium">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Confirm new password"
                  />
                  <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Security Tips */}
              <div className="bg-gray-50 rounded-xl p-6 border border-line-light">
                <div className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <Shield className="w-4 h-4 text-brand" />
                  Security Tips
                </div>
                <ul className="list-disc pl-5 text-sm text-dim space-y-1">
                  <li>Use a unique password for your account</li>
                  <li>Avoid using personal information in passwords</li>
                  <li>Consider using a password manager</li>
                  <li>Change your password if you suspect it&apos;s been compromised</li>
                </ul>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-hover disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                {loading ? <><Spinner size="sm" className="border-white border-t-transparent" /> Updating Password...</> : "Update Password"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
