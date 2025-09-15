"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  LocationOn,
  Settings,
  Lock,
  Business,
  Description,
  RequestQuote,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";

interface ProfileLayoutWrapperProps {
  children: React.ReactNode;
  title: string;
}

const ProfileLayoutWrapper: React.FC<ProfileLayoutWrapperProps> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { customer } = useAppStore();

  const menuItems = [
    {
      id: "account",
      label: "Account Overview",
      icon: <Person />,
      path: "/profile/account",
    },
    {
      id: "rfq",
      label: "RFQ Management",
      icon: <RequestQuote />,
      path: "/profile/rfq-management",
    },
    {
      id: "addresses",
      label: "Address Management",
      icon: <LocationOn />,
      path: "/profile/address-management",
    },
    {
      id: "orders",
      label: "Orders Management",
      icon: <ShoppingBag />,
      path: "/profile/orders-management",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings />,
      path: "/profile/settings",
    },
    {
      id: "change-password",
      label: "Change Password",
      icon: <Lock />,
      path: "/profile/change-password",
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Left Sidebar */}
      <Paper
        elevation={1}
        sx={{
          width: 280,
          minHeight: "100vh",
          backgroundColor: "white",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Profile Header */}
        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "#ff6b35",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              {customer?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  fontSize: "0.95rem",
                }}
              >
                {customer?.name || "User"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7f8c8d",
                  fontSize: "0.8rem",
                }}
              >
                {customer?.email || "user@example.com"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, py: 1 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? "#fff5f2" : "transparent",
                      color: isActive ? "#ff6b35" : "#5a6c7d",
                      "&:hover": {
                        backgroundColor: isActive ? "#fff5f2" : "#f8f9fa",
                        color: isActive ? "#ff6b35" : "#2c3e50",
                      },
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? "#ff6b35" : "#7f8c8d",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          overflow: "auto",
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid #e0e0e0",
            px: 4,
            py: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "1.5rem",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default ProfileLayoutWrapper;
