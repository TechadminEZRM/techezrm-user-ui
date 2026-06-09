"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInitiateSignup, useVerifyOtp, useCompleteSignup } from "@/api/handlers";
import ChatWidget from "@/components/ChatWidget";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type SignupStep = "email" | "otp" | "details" | "success";

const inputClass =
  "w-full border-0 border-b border-line-light bg-transparent text-body text-base py-3 placeholder:text-faint focus:outline-none focus:border-brand transition-colors";

const errorInputClass =
  "w-full border-0 border-b border-red-400 bg-transparent text-body text-base py-3 placeholder:text-faint focus:outline-none focus:border-red-500 transition-colors";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [address, setAddress] = useState("");
  const [connectBy, setConnectBy] = useState("email");
  const [otp, setOtp] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, []);

  const initiateSignupMutation = useInitiateSignup();
  const verifyOtpMutation = useVerifyOtp();
  const completeSignupMutation = useCompleteSignup();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const publicDomains = ["hotmail.com", "outlook.com", "aol.com", "icloud.com", "live.com", "msn.com", "rediffmail.com"];
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    const domain = email.split("@")[1]?.toLowerCase();
    if (publicDomains.includes(domain)) return "Public email domains are not allowed. Please enter a valid company email address.";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    if (phone.length < 10) return "Please enter a valid phone number";
    return "";
  };

  const handleStep1Submit = async () => {
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const nameErr = !name ? "Name is required" : "";
    setEmailError(emailErr);
    setPhoneError(phoneErr);
    setNameError(nameErr);
    if (!emailErr && !phoneErr && !nameErr) {
      try {
        await initiateSignupMutation.mutateAsync({ email, phone, name, connectBy });
        setCurrentStep("otp");
      } catch (error) {
        console.error("Step 1 submission failed:", error);
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    setOtpError("");
    try {
      await verifyOtpMutation.mutateAsync({ email, otp });
      setCurrentStep("details");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await initiateSignupMutation.mutateAsync({ email, phone, name, connectBy });
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  const handleStep2Submit = async () => {
    const orgErr = !organizationName ? "Organization Name is required" : "";
    const addressErr = !address ? "Address is required" : "";
    setOrganizationError(orgErr);
    setAddressError(addressErr);
    if (!orgErr && !addressErr) {
      try {
        await completeSignupMutation.mutateAsync({
          email, phone, name, organizationName, address,
          industry: "", website: "", employeeCount: 0, annualRevenue: "",
          businessType: "", taxId: "", registrationNumber: "",
          contactPerson: "", contactPersonPhone: "", contactPersonEmail: "", notes: "",
        });
        setCurrentStep("success");
      } catch (error) {
        console.error("Step 2 submission failed:", error);
      }
    }
  };

  const handleBackToHome = () => router.push("/");

  const renderStep1 = () => (
    <>
      <p className="font-semibold text-body mb-8 text-xl">Buyer Registration</p>
      <div className="w-full max-w-[400px]">
        <p className="text-soft mb-6 text-sm font-semibold">Step 1 : Provide your Details</p>

        {initiateSignupMutation.isError && (
          <Alert variant="destructive" className="mb-4">
            {initiateSignupMutation.error instanceof Error ? initiateSignupMutation.error.message : "Failed to proceed"}
          </Alert>
        )}

        <div className="mb-6">
          <input placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); if (nameError) setNameError(""); }} disabled={initiateSignupMutation.isPending} className={nameError ? errorInputClass : inputClass} />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>

        <div className="mb-6">
          <input placeholder="Email - ID" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }} disabled={initiateSignupMutation.isPending} className={emailError ? errorInputClass : inputClass} />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        <div className="mb-6">
          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => { const value = e.target.value.replace(/\D/g, ""); setPhone(value); if (phoneError) setPhoneError(""); }}
            disabled={initiateSignupMutation.isPending}
            className={phoneError ? errorInputClass : inputClass}
          />
          {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
        </div>

        <p className="text-soft text-sm font-semibold mb-4">Connect By</p>
        <div className="mb-8">
          <RadioGroup value={connectBy} onValueChange={setConnectBy} className="flex flex-row gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="email" />
              <span className="text-sm text-body">Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="whatsapp" />
              <span className="text-sm text-body">Whatsapp</span>
            </label>
          </RadioGroup>
        </div>

        <button
          onClick={handleStep1Submit}
          disabled={initiateSignupMutation.isPending}
          className="w-full bg-brand text-white font-medium py-[14px] rounded-[30px] text-base hover:bg-brand-hover disabled:bg-gray-300 transition-colors mb-4"
        >
          {initiateSignupMutation.isPending ? (
            <span className="flex items-center justify-center gap-2"><Spinner size="sm" className="border-white border-t-transparent" />Sending...</span>
          ) : "Submit"}
        </button>
        <p className="text-dim text-xs">Public email domains are not allowed. Please enter a valid company email address.</p>
      </div>
    </>
  );

  const renderOtpStep = () => (
    <>
      <p className="font-semibold text-body mb-8 text-xl">Buyer Registration</p>
      <div className="w-full max-w-[400px]">
        <p className="text-soft mb-6 text-sm font-semibold">Step 2 : Verify your Email</p>

        {verifyOtpMutation.isError && (
          <Alert variant="destructive" className="mb-4">
            {verifyOtpMutation.error instanceof Error ? verifyOtpMutation.error.message : "Failed to verify OTP"}
          </Alert>
        )}

        <p className="text-dim text-sm mb-6">We sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below.</p>

        <div className="mb-6">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => { const value = e.target.value.replace(/\D/g, "").slice(0, 6); setOtp(value); if (otpError) setOtpError(""); }}
            disabled={verifyOtpMutation.isPending}
            maxLength={6}
            className={`${otpError ? errorInputClass : inputClass} tracking-[8px] text-center`}
          />
          {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
        </div>

        <button
          onClick={handleOtpSubmit}
          disabled={verifyOtpMutation.isPending || otp.length !== 6}
          className="w-full bg-brand text-white font-medium py-[14px] rounded-[30px] text-base hover:bg-brand-hover disabled:bg-gray-300 transition-colors mb-4"
        >
          {verifyOtpMutation.isPending ? (
            <span className="flex items-center justify-center gap-2"><Spinner size="sm" className="border-white border-t-transparent" />Verifying...</span>
          ) : "Verify OTP"}
        </button>

        <div className="flex justify-center gap-2">
          <span className="text-dim text-[13px]">Didnt receive the code?</span>
          <span
            onClick={!initiateSignupMutation.isPending ? handleResendOtp : undefined}
            className={`text-brand text-[13px] font-semibold ${initiateSignupMutation.isPending ? "cursor-default" : "cursor-pointer hover:underline"}`}
          >
            {initiateSignupMutation.isPending ? "Sending..." : "Resend OTP"}
          </span>
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <p className="font-semibold text-body mb-8 text-xl">Buyer Registration</p>
      <div className="w-full max-w-[400px]">
        <p className="text-soft mb-6 text-sm font-semibold">Step 3 : Provide your Details</p>

        {completeSignupMutation.isError && (
          <Alert variant="destructive" className="mb-4">
            {completeSignupMutation.error instanceof Error ? completeSignupMutation.error.message : "Failed to complete registration"}
          </Alert>
        )}

        <div className="mb-6">
          <input
            placeholder="Organization Name"
            value={organizationName}
            onChange={(e) => { setOrganizationName(e.target.value); if (organizationError) setOrganizationError(""); }}
            disabled={completeSignupMutation.isPending}
            className={organizationError ? errorInputClass : inputClass}
          />
          {organizationError && <p className="text-red-500 text-xs mt-1">{organizationError}</p>}
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => { setAddress(e.target.value); if (addressError) setAddressError(""); }}
            disabled={completeSignupMutation.isPending}
            rows={4}
            className={`w-full border-0 border-b ${addressError ? "border-red-400" : "border-line-light"} bg-transparent text-body text-base py-3 placeholder:text-faint focus:outline-none focus:border-brand transition-colors resize-none`}
          />
          {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
        </div>

        <button
          onClick={handleStep2Submit}
          disabled={completeSignupMutation.isPending}
          className="w-full bg-brand text-white font-medium py-[14px] rounded-[30px] text-base hover:bg-brand-hover disabled:bg-gray-300 transition-colors mb-4"
        >
          {completeSignupMutation.isPending ? (
            <span className="flex items-center justify-center gap-2"><Spinner size="sm" className="border-white border-t-transparent" />Completing...</span>
          ) : "Submit"}
        </button>
        <p className="text-dim text-xs">Public email domains are not allowed. Please enter a valid company email address.</p>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <div className="flex flex-col items-center text-center w-full max-w-[400px] mt-4">
      <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center mb-6">
        <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center">
          <span className="text-brand text-base font-bold">✓</span>
        </div>
      </div>
      <p className="font-semibold text-body mb-4 text-lg">Application Submitted</p>
      <p className="text-dim text-sm leading-relaxed mb-2">
        Thank you, {name}! Your registration has been submitted successfully.
      </p>
      <p className="text-dim text-sm leading-relaxed mb-6">
        Our team will review your application and you will receive login credentials via email once approved.
      </p>
      <button
        onClick={handleBackToHome}
        className="w-full bg-brand text-white font-medium py-[14px] rounded-[30px] text-base hover:bg-brand-hover transition-colors"
      >
        Back To Home
      </button>
    </div>
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <Image src="/signBack.png" alt="Background" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />

      {/* Left Side */}
      <div className="absolute left-0 top-0 w-[35%] h-full flex items-center justify-center z-[2] px-8">
        <div className="text-center max-w-[350px]">
          <p className="text-white font-semibold text-[1.6rem] md:text-[24px] leading-tight mb-4" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            Welcome to B2B Market Place
          </p>
          <p className="text-white/95 text-[0.95rem] leading-relaxed font-light" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
            Your Gateway to Effortless Management
          </p>
          <p className="text-white/95 text-[0.95rem] leading-relaxed font-light" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
            Your Gateway to Effortless
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div
        className="absolute right-0 top-0 w-[65%] h-full bg-white flex items-center justify-center z-[3] overflow-auto"
        style={{ borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }}
      >
        <div className="w-full max-w-[500px] px-6 sm:px-12 py-8 flex flex-col items-center">
          <div className="mb-4">
            <Image src="/ezrm-logo.png" alt="EZRM Logo" width={140} height={50} style={{ objectFit: "contain" }} />
          </div>
          {currentStep === "email" && renderStep1()}
          {currentStep === "otp" && renderOtpStep()}
          {currentStep === "details" && renderStep2()}
          {currentStep === "success" && renderSuccessStep()}
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className="block md:hidden absolute inset-0 bg-black/30 z-[1]" />
      <ChatWidget />
    </div>
  );
}
