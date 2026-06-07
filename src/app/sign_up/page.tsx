"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInitiateSignup, useVerifyOtp, useCompleteSignup } from "@/api/handlers";
import ChatWidget from "@/components/ChatWidget";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7A59",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

type SignupStep = "email" | "otp" | "details" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [address, setAddress] = useState("");
  const [connectBy, setConnectBy] = useState("email"); // Include in UI state but not in API
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

  // API hooks
  const initiateSignupMutation = useInitiateSignup();
  const verifyOtpMutation = useVerifyOtp();
  const completeSignupMutation = useCompleteSignup();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const publicDomains = [
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "icloud.com",
      "live.com",
      "msn.com",
      "rediffmail.com",
    ];

    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (publicDomains.includes(domain)) {
      return "Public email domains are not allowed. Please enter a valid company email address.";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
      return "Phone number is required";
    }
    if (phone.length < 10) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  // Handle step 1 submission (email, phone, name) - connectBy NOT included in API
  const handleStep1Submit = async () => {
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const nameErr = !name ? "Name is required" : "";

    setEmailError(emailErr);
    setPhoneError(phoneErr);
    setNameError(nameErr);

    if (!emailErr && !phoneErr && !nameErr) {
      try {
        await initiateSignupMutation.mutateAsync({
          email,
          phone,
          name,
          connectBy
        });
        setCurrentStep("otp");
      } catch (error) {
        console.error("Step 1 submission failed:", error);
      }
    }
  };

  // Handle OTP verification
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

  // Handle step 2 submission (organization name, address) - connectBy NOT included in API
  const handleStep2Submit = async () => {
    const orgErr = !organizationName ? "Organization Name is required" : "";
    const addressErr = !address ? "Address is required" : "";

    setOrganizationError(orgErr);
    setAddressError(addressErr);

    if (!orgErr && !addressErr) {
      try {
        await completeSignupMutation.mutateAsync({
          email,
          phone,
          name,
          organizationName,
          address,
          industry: "",
          website: "",
          employeeCount: 0,
          annualRevenue: "",
          businessType: "",
          taxId: "",
          registrationNumber: "",
          contactPerson: "",
          contactPersonPhone: "",
          contactPersonEmail: "",
          notes: "",
        });
        setCurrentStep("success");
      } catch (error) {
        console.error("Step 2 submission failed:", error);
      }
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const renderStep1 = () => (
    <>
      <Typography
        sx={{
          fontWeight: 600,
          color: "#333",
          mb: 4,
          fontSize: "20px",
        }}
      >
        Buyer Registration
      </Typography>

      <Box sx={{ width: "100%", maxWidth: "400px" }}>
        <Typography
          sx={{
            color: "#5A607F",
            mb: 3,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Step 1 : Provide your Details
        </Typography>

        {initiateSignupMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {initiateSignupMutation.error instanceof Error
              ? initiateSignupMutation.error.message
              : "Failed to proceed"}
          </Alert>
        )}

        {/* Name Field */}
        <TextField
          fullWidth
          placeholder="Name"
          variant="standard"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) {
              setNameError("");
            }
          }}
          error={!!nameError}
          disabled={initiateSignupMutation.isPending}
          sx={{
            mb: nameError ? 1 : 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: nameError ? "#f44336" : "#e0e0e0",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: nameError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: nameError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInputBase-input": {
              padding: "12px 0",
              fontSize: "1rem",
              color: "#333",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
        {nameError && (
          <Typography
            sx={{
              color: "#f44336",
              fontSize: "12px",
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {nameError}
          </Typography>
        )}

        {/* Email Field */}
        <TextField
          fullWidth
          placeholder="Email - ID"
          variant="standard"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) {
              setEmailError("");
            }
          }}
          error={!!emailError}
          disabled={initiateSignupMutation.isPending}
          sx={{
            mb: emailError ? 1 : 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: emailError ? "#f44336" : "#e0e0e0",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: emailError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: emailError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInputBase-input": {
              padding: "12px 0",
              fontSize: "1rem",
              color: "#333",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
        {emailError && (
          <Typography
            sx={{
              color: "#f44336",
              fontSize: "12px",
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {emailError}
          </Typography>
        )}

        {/* Phone Number Field */}
        <TextField
          fullWidth
          placeholder="Phone Number"
          variant="standard"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);
            if (phoneError) {
              setPhoneError("");
            }
          }}
          error={!!phoneError}
          disabled={initiateSignupMutation.isPending}
          sx={{
            mb: phoneError ? 1 : 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: phoneError ? "#f44336" : "#e0e0e0",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: phoneError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: phoneError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInputBase-input": {
              padding: "12px 0",
              fontSize: "1rem",
              color: "#333",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
        {phoneError && (
          <Typography
            sx={{
              color: "#f44336",
              fontSize: "12px",
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {phoneError}
          </Typography>
        )}

        {/* Connect By Options - UI ONLY, not sent to API */}
        <Typography
          sx={{
            color: "#5A607F",
            fontSize: "14px",
            fontWeight: 600,
            mb: 2,
          }}
        >
          Connect By
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <RadioGroup
            row
            value={connectBy}
            onChange={(e) => setConnectBy(e.target.value)} // UI state only
            sx={{
              gap: 3,
            }}
          >
            <FormControlLabel
              value="email"
              control={
                <Radio
                  sx={{
                    color: "#E5E7EB",
                    "&.Mui-checked": {
                      color: "#FF7A59",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "14px", color: "#333", ml: 0.5 }}>
                  Email
                </Typography>
              }
            />
            <FormControlLabel
              value="whatsapp"
              control={
                <Radio
                  sx={{
                    color: "#E5E7EB",
                    "&.Mui-checked": {
                      color: "#FF7A59",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 20,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "14px", color: "#333", ml: 0.5 }}>
                  Whatsapp
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleStep1Submit}
          disabled={initiateSignupMutation.isPending}
          sx={{
            backgroundColor: "#FF7A59",
            color: "white",
            py: 1.8,
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            mb: 2,
            maxWidth: "500px",
            "&:hover": {
              backgroundColor: "#FF5722",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
          }}
        >
          {initiateSignupMutation.isPending ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Sending...
            </Box>
          ) : (
            "Submit"
          )}
        </Button>

        <Typography
          sx={{
            color: "#666",
            fontSize: "12px",
            mb: 3,
            textAlign: "left",
            width: "100%",
          }}
        >
          Public email domains are not allowed. Please enter a valid company
          email address.
        </Typography>
      </Box>
    </>
  );

  const renderOtpStep = () => (
    <>
      <Typography
        sx={{
          fontWeight: 600,
          color: "#333",
          mb: 4,
          fontSize: "20px",
        }}
      >
        Buyer Registration
      </Typography>

      <Box sx={{ width: "100%", maxWidth: "400px" }}>
        <Typography
          sx={{
            color: "#5A607F",
            mb: 3,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Step 2 : Verify your Email
        </Typography>

        {verifyOtpMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {verifyOtpMutation.error instanceof Error
              ? verifyOtpMutation.error.message
              : "Failed to verify OTP"}
          </Alert>
        )}

        <Typography
          sx={{
            color: "#666",
            fontSize: "14px",
            mb: 3,
            textAlign: "left",
          }}
        >
          We sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below.
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter OTP"
          variant="standard"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(value);
            if (otpError) setOtpError("");
          }}
          error={!!otpError}
          disabled={verifyOtpMutation.isPending}
          inputProps={{ maxLength: 6, inputMode: "numeric" }}
          sx={{
            mb: otpError ? 1 : 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: otpError ? "#f44336" : "#e0e0e0",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: otpError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: otpError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInputBase-input": {
              padding: "12px 0",
              fontSize: "1rem",
              color: "#333",
              letterSpacing: "8px",
              textAlign: "center",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
        {otpError && (
          <Typography
            sx={{
              color: "#f44336",
              fontSize: "12px",
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {otpError}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleOtpSubmit}
          disabled={verifyOtpMutation.isPending || otp.length !== 6}
          sx={{
            backgroundColor: "#FF7A59",
            color: "white",
            py: 1.8,
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            mb: 2,
            maxWidth: "500px",
            "&:hover": {
              backgroundColor: "#FF5722",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
          }}
        >
          {verifyOtpMutation.isPending ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Verifying...
            </Box>
          ) : (
            "Verify OTP"
          )}
        </Button>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Typography sx={{ color: "#666", fontSize: "13px" }}>
            Didnt receive the code?
          </Typography>
          <Typography
            onClick={!initiateSignupMutation.isPending ? handleResendOtp : undefined}
            sx={{
              color: "#FF7A59",
              fontSize: "13px",
              fontWeight: 600,
              cursor: initiateSignupMutation.isPending ? "default" : "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {initiateSignupMutation.isPending ? "Sending..." : "Resend OTP"}
          </Typography>
        </Box>
      </Box>
    </>
  );

  const renderStep2 = () => (
    <>
      <Typography
        sx={{
          fontWeight: 600,
          color: "#333",
          mb: 4,
          fontSize: "20px",
        }}
      >
        Buyer Registration
      </Typography>

      <Box sx={{ width: "100%", maxWidth: "400px" }}>
        <Typography
          sx={{
            color: "#5A607F",
            mb: 3,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Step 3 : Provide your Details
        </Typography>

        {completeSignupMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {completeSignupMutation.error instanceof Error
              ? completeSignupMutation.error.message
              : "Failed to complete registration"}
          </Alert>
        )}

        {/* Organization Name Field */}
        <TextField
          fullWidth
          placeholder="Organization Name"
          variant="standard"
          value={organizationName}
          onChange={(e) => {
            setOrganizationName(e.target.value);
            if (organizationError) {
              setOrganizationError("");
            }
          }}
          error={!!organizationError}
          disabled={completeSignupMutation.isPending}
          sx={{
            mb: organizationError ? 1 : 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: organizationError ? "#f44336" : "#e0e0e0",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: organizationError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: organizationError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInputBase-input": {
              padding: "12px 0",
              fontSize: "1rem",
              color: "#333",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
        {organizationError && (
          <Typography
            sx={{
              color: "#f44336",
              fontSize: "12px",
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {organizationError}
          </Typography>
        )}

        {/* Address Field */}
        <TextField
          fullWidth
          placeholder="Address"
          variant="standard"
          multiline
          rows={4}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (addressError) {
              setAddressError("");
            }
          }}
          error={!!addressError}
          disabled={completeSignupMutation.isPending}
          sx={{
            mb: addressError ? 1 : 4,
            "& .MuiInput-underline:before": {
              borderBottomColor: addressError ? "#f44336" : "#e0e0e0",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: addressError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: addressError ? "#f44336" : "#FF7A59",
            },
            "& .MuiInputBase-input": {
              padding: "12px 0",
              fontSize: "1rem",
              color: "#333",
              "&::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
        />
        {addressError && (
          <Typography
            sx={{
              color: "#f44336",
              fontSize: "12px",
              mb: 3,
              textAlign: "left",
              width: "100%",
            }}
          >
            {addressError}
          </Typography>
        )}

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleStep2Submit}
          disabled={completeSignupMutation.isPending}
          sx={{
            backgroundColor: "#FF7A59",
            color: "white",
            py: 1.8,
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            mb: 2,
            maxWidth: "500px",
            "&:hover": {
              backgroundColor: "#FF5722",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
          }}
        >
          {completeSignupMutation.isPending ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Completing...
            </Box>
          ) : (
            "Submit"
          )}
        </Button>

        <Typography
          sx={{
            color: "#666",
            fontSize: "12px",
            mb: 3,
            textAlign: "left",
            width: "100%",
          }}
        >
          Public email domains are not allowed. Please enter a valid company
          email address.
        </Typography>
      </Box>
    </>
  );

  const renderSuccessStep = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: "400px",
        mt: 2,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#FF7A59",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{ color: "#FF7A59", fontSize: "16px", fontWeight: "bold" }}
          >
            ✓
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          fontWeight: 600,
          color: "#333",
          mb: 2,
          fontSize: "18px",
        }}
      >
        Application Submitted
      </Typography>

      <Typography
        sx={{
          color: "#666",
          fontSize: "14px",
          lineHeight: 1.5,
          mb: 1,
        }}
      >
        Thank you, {name}! Your registration has been submitted successfully.
      </Typography>

      <Typography
        sx={{
          color: "#666",
          fontSize: "14px",
          lineHeight: 1.5,
          mb: 3,
        }}
      >
        Our team will review your application and you will receive login credentials via email once approved.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={handleBackToHome}
        sx={{
          backgroundColor: "#FF7A59",
          color: "white",
          py: 1.8,
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: 500,
          textTransform: "none",
          maxWidth: "500px",
          "&:hover": {
            backgroundColor: "#FF5722",
          },
        }}
      >
        Back To Home
      </Button>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
        {/* Full Screen Background Image */}
        <Image
          src="/signBack.png"
          alt="Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />

        {/* Left Side Content - Welcome Text (35% width) */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "35%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            px: 4,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              maxWidth: "350px",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: { xs: "1.6rem", md: "24px" },
                lineHeight: 1.2,
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Welcome to B2B Market Place
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.95)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                fontWeight: 300,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Your Gateway to Effortless Management
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.95)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                fontWeight: 300,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Your Gateway to Effortless
            </Typography>
          </Box>
        </Box>

        {/* Right Side Overlay - Registration Form (65% width) */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "65%",
            height: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
            boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            overflow: "auto",
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: { xs: 3, sm: 6 },
                py: 4,
                width: "100%",
              }}
            >
              {/* Logo */}
              <Box sx={{ mb: 2 }}>
                <Image
                  src="/ezrm-logo.png"
                  alt="EZRM Logo"
                  width={140}
                  height={50}
                  style={{ objectFit: "contain" }}
                />
              </Box>

              {/* Conditional Rendering based on current step */}
              {currentStep === "email" && renderStep1()}
              {currentStep === "otp" && renderOtpStep()}
              {currentStep === "details" && renderStep2()}
              {currentStep === "success" && renderSuccessStep()}
            </Box>
          </Container>
        </Box>

        {/* Mobile Responsive Overlay */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1,
          }}
        />

        {/* Chat Widget */}
        <ChatWidget />
      </Box>
    </ThemeProvider>
  );
}
