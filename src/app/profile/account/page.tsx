"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  Person,
  Business,
  Phone,
  Email,
  LocationOn,
  Edit,
  BusinessCenter,
  AttachMoney,
  Group,
  Language,
  Description,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import { useAppStore } from "@/store/use-app-store";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";

interface CustomerProfile {
  name: string;
  phone: string;
  companyName: string;
  companyAddress: string;
  businessType: string;
  annualRevenue: string;
  employeeCount: string;
  website: string;
  description: string;
}

const AccountOverviewPage: React.FC = () => {
  const router = useRouter();
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

  const handleEditProfile = () => {
    router.push("/profile/account/edit");
  };

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
        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Person sx={{ color: "#ff6b35", fontSize: 24 }} />
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

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: "#ff6b35",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        fontSize: "1.1rem",
                      }}
                    >
                      {profile?.name || "Not provided"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {customer?.email || "Not provided"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ space: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Phone sx={{ color: "#7f8c8d", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {profile?.phone || "Not provided"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Email sx={{ color: "#7f8c8d", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {customer?.email || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Business Information Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Business sx={{ color: "#ff6b35", fontSize: 24 }} />
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

                <Box sx={{ space: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Business sx={{ color: "#7f8c8d", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {profile?.companyName || "Not provided"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <BusinessCenter sx={{ color: "#7f8c8d", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {profile?.businessType || "Not provided"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <AttachMoney sx={{ color: "#7f8c8d", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {profile?.annualRevenue || "Not provided"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Group sx={{ color: "#7f8c8d", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontSize: "0.875rem",
                      }}
                    >
                      {profile?.employeeCount || "Not provided"} employees
                    </Typography>
                  </Box>

                  {profile?.website && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Language sx={{ color: "#7f8c8d", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#5a6c7d",
                          fontSize: "0.875rem",
                        }}
                      >
                        {profile.website}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Company Address Card */}
          {profile?.companyAddress && (
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid #f0f0f0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <LocationOn sx={{ color: "#ff6b35", fontSize: 24 }} />
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
                    variant="body2"
                    sx={{
                      color: "#5a6c7d",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {profile.companyAddress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Business Description Card */}
          {profile?.description && (
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid #f0f0f0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Description sx={{ color: "#ff6b35", fontSize: 24 }} />
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
                    variant="body2"
                    sx={{
                      color: "#5a6c7d",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {profile.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                sx={{
                  background:
                    "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #e55a2b 0%, #ff6b35 100%)",
                  },
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default AccountOverviewPage;
