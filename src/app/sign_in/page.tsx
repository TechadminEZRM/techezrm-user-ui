"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCustomerLogin } from "@/api/handlers";
import ChatWidget from "@/components/ChatWidget";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useCustomerLogin();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await loginMutation.mutateAsync({ email, password });
      router.push("/");
    } catch (error: any) {
      if (error?.signupStep) {
        router.push(`/sign_up?email=${encodeURIComponent(email)}`);
        return;
      }
      console.error("Login error:", error);
    }
  };

  const handleSignUpClick = () => router.push("/sign_up");

  const inputClass =
    "w-full border-0 border-b border-[#e0e0e0] bg-transparent text-[#333] text-base py-3 placeholder:text-[#999] focus:outline-none focus:border-[#F9A922] transition-colors";

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Full Screen Background Image */}
      <Image
        src="/signBack.png"
        alt="Background"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />

      {/* Left Side Content */}
      <div className="absolute left-0 top-0 w-[35%] h-full flex items-center justify-center z-[2] px-8">
        <div className="text-center max-w-[350px]">
          <p
            className="text-white font-semibold text-[1.6rem] md:text-[24px] leading-tight mb-4"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Welcome to B2B Market Place
          </p>
          <p
            className="text-white/95 text-[0.95rem] leading-relaxed font-light"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            Your Gateway to Effortless Management
          </p>
          <p
            className="text-white/95 text-[0.95rem] leading-relaxed font-light"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            Your Gateway to Effortless
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="absolute right-0 top-0 w-[65%] h-full bg-white flex items-center justify-center z-[3]"
        style={{
          borderTopLeftRadius: "24px",
          borderBottomLeftRadius: "24px",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <div className="w-full max-w-[600px] px-6 sm:px-12 py-8 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-2 mt-8">
            <Image src="/ezrm-logo.png" alt="EZRM Logo" width={200} height={60} style={{ objectFit: "contain" }} />
          </div>

          <p className="font-semibold text-[#333] mb-2 text-xl">Welcome Back</p>
          <p className="text-[#666] mb-8 text-[15px]">Sign in to your Account</p>

          {/* Error Alert */}
          {loginMutation.isError && (
            <Alert variant="destructive" className="w-full max-w-[500px] mb-4">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Login failed. Please try again."}
            </Alert>
          )}

          {/* Success Alert */}
          {loginMutation.isSuccess && (
            <Alert variant="success" className="w-full max-w-[500px] mb-4">
              Login successful! Redirecting...
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full max-w-[500px]">
            <div className="mb-8">
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                className={inputClass}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-8">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className={inputClass}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#F9A922] text-white font-bold py-[14px] rounded-[30px] text-base hover:bg-[#E8981F] disabled:bg-gray-300 transition-colors mb-4"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-right mb-6">
              <a href="#" className="text-[#F9A922] text-[0.9rem] hover:underline">
                Forgot Password?
              </a>
            </div>

            <div className="text-center cursor-pointer" onClick={handleSignUpClick}>
              <span className="text-[#666] text-[0.9rem]">
                {"Don't have an account? "}
                <span className="text-[#F9A922] font-medium hover:underline">Sign up Here</span>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className="block md:hidden absolute inset-0 bg-black/30 z-[1]" />

      <ChatWidget />
    </div>
  );
}
