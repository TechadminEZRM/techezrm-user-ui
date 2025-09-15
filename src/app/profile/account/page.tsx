"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import {
  Person,
  Business,
  Phone,
  Email,
  LocationOn,
  BusinessCenter,
  AttachMoney,
  Group,
  Language,
  Description,
  AccountCircle,
  Work,
  Public,
} from "@mui/icons-material";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import { useAppStore } from "@/store/use-app-store";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import { CustomerProfile } from "@/api/services/customerProfile";

const AccountOverviewPage: React.FC = () => {
  const { customer } = useAppStore();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!customer?.id) return;

      try {
        const data = await customerProfileHandler.getProfile(customer.id);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [customer?.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <ProfileLayoutWrapper title="Account Overview">
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        </ProfileLayoutWrapper>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Account Overview">
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Premium Account Overview Card */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)",
              border: "1px solid rgba(255, 107, 53, 0.1)",
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  "linear-gradient(90deg, #ff6b35 0%, #ff8c42 50%, #ff6b35 100%)",
              },
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header Section */}
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                  p: 4,
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "2rem",
                      fontWeight: 700,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.8rem",
                        mb: 1,
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {profile?.name || "User Name"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        fontSize: "1rem",
                        opacity: 0.9,
                        mb: 2,
                      }}
                    >
                      {customer?.email || "user@example.com"}
                    </Typography>
                    <Chip
                      label="Active Account"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 500,
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Content Sections */}
              <Box sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    mb: 4,
                  }}
                >
                  {/* Personal Information Section */}
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#fafbfc",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                            color: "white",
                          }}
                        >
                          <AccountCircle sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#2c3e50",
                            fontSize: "1.1rem",
                          }}
                        >
                          Personal Information
                        </Typography>
                      </Box>

                      <Stack spacing={2.5}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Phone sx={{ color: "#7f8c8d", fontSize: 20 }} />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#95a5a6",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Phone Number
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {profile?.phone || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Email sx={{ color: "#7f8c8d", fontSize: 20 }} />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#95a5a6",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Email Address
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {customer?.email || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Business Information Section */}
                  <Box sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#fafbfc",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                            color: "white",
                          }}
                        >
                          <Work sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#2c3e50",
                            fontSize: "1.1rem",
                          }}
                        >
                          Business Information
                        </Typography>
                      </Box>

                      <Stack spacing={2.5}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Business sx={{ color: "#7f8c8d", fontSize: 20 }} />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#95a5a6",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Company Name
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {profile?.companyName || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <BusinessCenter
                            sx={{ color: "#7f8c8d", fontSize: 20 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#95a5a6",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Business Type
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {profile?.businessType || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <AttachMoney
                            sx={{ color: "#7f8c8d", fontSize: 20 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#95a5a6",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Annual Revenue
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {profile?.annualRevenue || "Not provided"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Group sx={{ color: "#7f8c8d", fontSize: 20 }} />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#95a5a6",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Employee Count
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {profile?.employeeCount || "Not provided"}{" "}
                              employees
                            </Typography>
                          </Box>
                        </Box>

                        {profile?.website && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Public sx={{ color: "#7f8c8d", fontSize: 20 }} />
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#95a5a6",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.5,
                                }}
                              >
                                Website
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: "#2c3e50",
                                  fontSize: "0.9rem",
                                  fontWeight: 500,
                                }}
                              >
                                {profile.website}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Box>
                </Box>

                {/* Company Address Section */}
                {profile?.companyAddress && (
                  <Box sx={{ mb: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#fafbfc",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                            color: "white",
                          }}
                        >
                          <LocationOn sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#2c3e50",
                            fontSize: "1.1rem",
                          }}
                        >
                          Company Address
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#2c3e50",
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        {profile.companyAddress}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Business Description Section */}
                {profile?.description && (
                  <Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#fafbfc",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                            color: "white",
                          }}
                        >
                          <Description sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#2c3e50",
                            fontSize: "1.1rem",
                          }}
                        >
                          Business Description
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#2c3e50",
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        {profile.description}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default AccountOverviewPage;
