"use client"
import type React from "react"
import { Box, Typography, Button, Container } from "@mui/material"
import { ArrowForward } from "@mui/icons-material"
import Image from "next/image"
import { useState } from "react"
import BookCallModal from "@/components/BookCallModal"

const PixelPerfectClone: React.FC = () => {
  const [bookCallModalOpen, setBookCallModalOpen] = useState(false);
  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background Image */}
        <Image
          src="/aboutbg.png"
          alt="About Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />

        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(19, 21, 35, 0.6)",
            zIndex: 1,
          }}
        />

        {/* Hero Content Container */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            px: { xs: 3, md: 1 },
          }}
        >
          <Box
            sx={{
              maxWidth: "900px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 3, md: 4 },
            }}
          >
            {/* Main Heading */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 600,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.5rem",
                  md: "4.5rem",
                  lg: "3rem",
                },
                lineHeight: {
                  xs: 1.1,
                  md: 1.2,
                },
                color: "white",
                textAlign: "center",
                letterSpacing: "-0.02em",
                mb: { xs: 2, md: 3 },
              }}
            >
              Fueling Possibilities Through Innovation
            </Typography>

            {/* Description Text */}
            <Typography
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1rem",
                },
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.85)",
                textAlign: "center",
                maxWidth: "800px",
                mx: "auto",
                mb: { xs: 3, md: 1 },
                px: { xs: 1, md: 0 },
              }}
            >
              At Easy Raw Materials Pvt. Ltd. (EZRM), we dont just supply ingredients—we fuel possibilities. Nestled in
              the high-performance hub of JNPT SEZ, India, we are reimagining the supply chain for food, pharma,
              nutraceutical, and animal nutrition industries.
            </Typography>

            {/* Book a Call Button */}
            <Button
              variant="contained"
              onClick={() => setBookCallModalOpen(true)}
              sx={{
                backgroundColor: "#ff6b35",
                color: "white",
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 600,
                fontSize: {
                  xs: "1rem",
                  md: "1rem",
                },
                textTransform: "none",
                borderRadius: "50px",
                px: { xs: 4, md: 5 },
                py: { xs: 1.5, md: 1 },
                minWidth: { xs: "160px", md: "220px" },
                boxShadow: "0 4px 16px rgba(255, 107, 53, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e55a2b",
                  boxShadow: "0 6px 20px rgba(255, 107, 53, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Book a Call
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            width: "80%",
            height: { xs: "auto", md: "100vh" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Left Side - Features & Capabilities */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              backgroundColor: "#fafafa",
              display: "flex",
              alignItems: "center",
              py: { xs: 6, md: 8 },
              px: { xs: 3, md: 6 },
            }}
          >
            <Box
              sx={{
                maxWidth: "500px",
                mx: "auto",
                width: "100%",
              }}
            >
              {/* Main Heading */}
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  lineHeight: 1.2,
                  color: "#333",
                  mb: { xs: 4, md: 6 },
                  letterSpacing: "-0.02em",
                }}
              >
                Our{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#ff6b35",
                  }}
                >
                  Core Services
                </Box>{" "}
                &<br />
                Capabilities
              </Typography>

              {/* Features List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Warehouse & Distribution */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <ArrowForward
                    sx={{
                      color: "#ff6b35",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      color: "#333",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Warehouse & Distribution
                  </Typography>
                </Box>

                {/* Innovation in Manufacturing */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <ArrowForward
                    sx={{
                      color: "#ccc",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      color: "#999",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Innovation in Manufacturing
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Content Details */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              py: { xs: 6, md: 8 },
              px: { xs: 3, md: 6 },
              minHeight: { xs: "500px", md: "100vh" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                maxWidth: "500px",
                mx: "auto",
                width: "100%",
              }}
            >
              {/* Intro Text */}
              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.6,
                  color: "rgba(10, 10, 10, 0.8)",
                  mb: { xs: 4, md: 5 },
                  letterSpacing: "0.01em",
                }}
              >
                Powered for scale and speed—EZRM streamlines how vitamins, sweeteners, amino acids, liposomes, and
                microencapsulated solutions move from our doors to yours.
              </Typography>

              {/* Main Description */}
              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  color: "black",
                  mb: { xs: 3, md: 4 },
                  letterSpacing: "-0.01em",
                }}
              >
                We engineer tomorrows solutions today. From precision vitamins and amino acids to cutting-edge
                liposomal and microencapsulation technologies, our offerings include:
              </Typography>

              {/* Features List */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {[
                  "High-performance specialty ingredients",
                  "Advanced liposomal formulations",
                  "Precision microencapsulation solutions",
                  "Quality vitamins and amino acids",
                  "SEZ advantages for global reach",
                ].map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#ff6b35",
                        mt: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 400,
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        lineHeight: 1.6,
                        color: "rgba(5, 5, 5, 0.9)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mission Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "60vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Image
          src="/vision.png"
          alt="Mission Background - Earth from Space"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />

        {/* Dark Overlay for better text readability */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          }}
        />

        {/* Mission Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            px: { xs: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              maxWidth: "1000px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 3, md: 1 },
            }}
          >
            {/* Mission Heading */}
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 600,
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                  lg: "3.5rem",
                },
                lineHeight: 1.2,
                color: "white",
                textAlign: "center",
                letterSpacing: "-0.02em",
                mb: { xs: 2, md: 3 },
              }}
            >
              Our{" "}
              <Box
                component="span"
                sx={{
                  color: "#ff6b35",
                }}
              >
                Mission
              </Box>
            </Typography>

            {/* Mission Description */}
            <Typography
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.25rem",
                  lg: "1rem",
                },
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.95)",
                textAlign: "center",
                maxWidth: "600px",
                mx: "auto",
                letterSpacing: "0.01em",
              }}
            >
              To make your supply chain faster, smarter, and more inventive than ever. We are innovators driven by
              efficiency, guided by science, and committed to unmatched reliability.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* What Makes EZRM Different Section */}
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ background: "#fafafa" }}>
        <Box
          sx={{
            width: "95%",
            py: { xs: 6, md: 10 },
            px: { xs: 3, md: 4 },
            background: "white",
            m: 3,
            borderRadius: "20px",
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              textAlign: "center",
            }}
          >
            {/* Section Header */}
            <Box sx={{ mb: { xs: 6, md: 8 } }} display={"flex"} gap={25} alignItems={"center"}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 600,
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.2rem",
                    md: "2.8rem",
                    lg: "1.5rem",
                  },
                  lineHeight: 1.2,
                  color: "#333",
                  letterSpacing: "-0.02em",
                  mb: { xs: 3, md: 4 },
                }}
              >
                What Makes EZRM{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#ff6b35",
                  }}
                >
                  Different
                </Box>{" "}
                from others
              </Typography>

              {/* Description Text */}
              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.6,
                  color: "#666",
                  maxWidth: "600px",
                  mx: "auto",
                  letterSpacing: "0.01em",
                }}
              >
                We are more than logistics and production. At EZRM, we combine strategic location advantages with
                cutting-edge technology and unwavering commitment to quality and innovation.
              </Typography>
            </Box>

            {/* Features Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: { xs: 3, md: 4 },
                mb: { xs: 4, md: 6 },
              }}
            >
              {/* SEZ Advantages */}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#ff6b35",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        width: "16px",
                        height: "2px",
                        backgroundColor: "white",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "8px",
                        height: "8px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        top: "6px",
                        right: "6px",
                      },
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "#333",
                    mb: 2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  SEZ Strategic Location
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: "0.875rem", md: "0.9rem" },
                    lineHeight: 1.5,
                    color: "#666",
                    letterSpacing: "0.01em",
                  }}
                >
                  JNPT SEZ advantages for seamless global operations and cost efficiency.
                </Typography>
              </Box>

              {/* Advanced Manufacturing */}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 24,
                      backgroundColor: "#ff6b35",
                      borderRadius: "2px",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        width: "6px",
                        height: "6px",
                        backgroundColor: "white",
                        borderRadius: "1px",
                        top: "4px",
                        left: "4px",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "16px",
                        height: "2px",
                        backgroundColor: "white",
                        borderRadius: "1px",
                        bottom: "4px",
                        left: "4px",
                      },
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "#333",
                    mb: 2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Advanced Manufacturing
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: "0.875rem", md: "0.9rem" },
                    lineHeight: 1.5,
                    color: "#666",
                    letterSpacing: "0.01em",
                  }}
                >
                  Cutting-edge liposomal and microencapsulation technologies.
                </Typography>
              </Box>

              {/* Integrated Supply Chain */}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  gridColumn: { xs: "1", sm: "1 / -1", md: "3" },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 20,
                      backgroundColor: "#4a90e2",
                      borderRadius: "2px",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        width: "8px",
                        height: "8px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        top: "50%",
                        left: "4px",
                        transform: "translateY(-50%)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "4px",
                        height: "4px",
                        backgroundColor: "#ff6b35",
                        borderRadius: "50%",
                        top: "2px",
                        right: "4px",
                      },
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "#333",
                    mb: 2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Integrated Supply Chain
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: "0.875rem", md: "0.9rem" },
                    lineHeight: 1.5,
                    color: "#666",
                    letterSpacing: "0.01em",
                  }}
                >
                  Seamless manufacturing, warehousing, and distribution solutions.
                </Typography>
              </Box>
            </Box>

            {/* Bottom Row - 2 Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: { xs: 3, md: 4 },
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              {/* Quality Assurance */}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: "#ffa500",
                        borderRadius: "50%",
                        position: "absolute",
                      }}
                    />
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        border: "2px solid #ffa500",
                        borderRadius: "50%",
                        position: "absolute",
                      }}
                    />
                    <Box
                      sx={{
                        width: 2,
                        height: 8,
                        backgroundColor: "#ffa500",
                        position: "absolute",
                        top: "2px",
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "#333",
                    mb: 2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Quality Assurance
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: "0.875rem", md: "0.9rem" },
                    lineHeight: 1.5,
                    color: "#666",
                    letterSpacing: "0.01em",
                  }}
                >
                  Rigorous testing and quality control for pharmaceutical-grade standards.
                </Typography>
              </Box>

              {/* Future-Forward Vision */}
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        border: "3px solid #4a90e2",
                        borderRadius: "50%",
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          width: "6px",
                          height: "6px",
                          backgroundColor: "#4a90e2",
                          borderRadius: "50%",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: "2px",
                          height: "8px",
                          backgroundColor: "#4a90e2",
                          top: "-8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "#333",
                    mb: 2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Future-Forward Vision
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: "0.875rem", md: "0.9rem" },
                    lineHeight: 1.5,
                    color: "#666",
                    letterSpacing: "0.01em",
                  }}
                >
                  Pioneering next-generation solutions for tomorrows challenges.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Who We Are Section */}
      <Box
        sx={{
          width: "100%",
          py: { xs: 6, md: 10 },
          px: { xs: 3, md: 4 },
          backgroundColor: "#fafafa",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 4, lg: 0 },
            alignItems: "stretch",
          }}
        >
          {/* Left Side - Team Image */}
          <Box
            sx={{
              width: { xs: "100%", lg: "50%" },
              position: "relative",
              minHeight: { xs: "300px", md: "400px", lg: "500px" },
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <Image
              src="/aboutlast.png"
              alt="EZRM Team - Professional business meeting"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
          </Box>

          {/* Right Side - Content */}
          <Box
            sx={{
              width: { xs: "100%", lg: "50%" },
              display: "flex",
              flexDirection: "column",
              pl: { xs: 0, lg: 4 },
            }}
          >
            {/* Who We Are Section */}
            <Box
              sx={{
                backgroundColor: "#2c3e50",
                borderRadius: "20px",
                p: { xs: 4, md: 5 },
                mb: 3,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: "1.75rem", md: "2.25rem", lg: "2.5rem" },
                  lineHeight: 1.2,
                  color: "white",
                  mb: 3,
                  letterSpacing: "-0.02em",
                }}
              >
                WHO{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#ff6b35",
                  }}
                >
                  WE
                </Box>{" "}
                ARE ?
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.9)",
                  letterSpacing: "0.01em",
                }}
              >
                Easy Raw Materials Pvt. Ltd. (EZRM) is strategically positioned in the JNPT SEZ, India, specializing in
                high-performance ingredients for food, pharma, nutraceutical, and animal nutrition industries. We
                combine manufacturing excellence with distribution efficiency to deliver innovative solutions globally.
              </Typography>
            </Box>

            {/* Our Promise Section */}
            <Box
              sx={{
                backgroundColor: "#ff6b35",
                borderRadius: "20px",
                p: { xs: 4, md: 5 },
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 600,
                  fontSize: { xs: "1.75rem", md: "2.25rem", lg: "2.5rem" },
                  lineHeight: 1.2,
                  color: "white",
                  mb: 3,
                  letterSpacing: "-0.02em",
                }}
              >
                Our Promise
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.6,
                  color: "white",
                  letterSpacing: "0.01em",
                  mb: 2,
                }}
              >
                We are more than logistics and production. At EZRM, we are innovators driven by efficiency, guided by
                science, and committed to unmatched reliability. With SEZ advantages and a future-forward vision, our
                mission is clear:
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.6,
                  color: "white",
                  letterSpacing: "0.01em",
                  fontStyle: "italic",
                }}
              >
                To make your supply chain faster, smarter, and more inventive than ever.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <BookCallModal
        open={bookCallModalOpen}
        onClose={() => setBookCallModalOpen(false)}
      />
    </Box>  
  )
}

export default PixelPerfectClone
