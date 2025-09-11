"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import {
  Notifications,
  Email,
  Sms,
  Security,
  Language,
  Palette,
  AccountCircle,
  CreditCard,
  Shield,
  Download,
  Delete,
  Star,
  CheckCircle,
  Diamond,
  Verified,
  WorkspacePremium,
} from "@mui/icons-material";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  securityAlerts: boolean;
}

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    securityAlerts: true,
  });

  const [language, setLanguage] = useState("english");
  const [theme, setTheme] = useState("light");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: 0,
      period: "month",
      features: [
        "Access to basic products",
        "Standard shipping",
        "Email support",
        "Basic order tracking",
      ],
      current: true,
      icon: <AccountCircle sx={{ fontSize: 32 }} />,
      color: "#757575",
    },
    {
      id: "premium",
      name: "Premium",
      price: 29,
      period: "month",
      features: [
        "Access to all products",
        "Free express shipping",
        "Priority customer support",
        "Advanced order tracking",
        "Exclusive discounts up to 15%",
        "Early access to new products",
      ],
      popular: true,
      icon: <Star sx={{ fontSize: 32 }} />,
      color: "#ff6b35",
    },
    {
      id: "vip",
      name: "VIP",
      price: 79,
      period: "month",
      features: [
        "Everything in Premium",
        "Free overnight shipping",
        "Dedicated account manager",
        "VIP customer service hotline",
        "Exclusive discounts up to 25%",
        "Access to limited edition products",
        "Monthly consultation sessions",
        "Custom packaging options",
      ],
      icon: <WorkspacePremium sx={{ fontSize: 32 }} />,
      color: "#ffd700",
    },
  ];

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePlanUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    // Implementation for plan upgrade would go here
    console.log(`Upgrading to ${planId} plan`);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {/* <Typography variant="h4" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
          Settings
        </Typography> */}
        <Typography variant="body1" sx={{ color: "#666" }}>
          Manage your account preferences, subscription, and notifications
        </Typography>
      </Box>

      {/* Subscription Plans */}
      {/* <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Diamond sx={{ color: "#ff6b35" }} />
            Subscription Plans
          </Typography>

          <Grid container spacing={3}>
            {subscriptionPlans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  sx={{
                    border: plan.current
                      ? "2px solid #ff6b35"
                      : plan.popular
                      ? "2px solid #ffd700"
                      : "1px solid #e0e0e0",
                    borderRadius: 2,
                    position: "relative",
                    height: "100%",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#ffd700",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {plan.current && (
                    <Chip
                      label="Current Plan"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#ff6b35",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Box sx={{ color: plan.color, mb: 2 }}>{plan.icon}</Box>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {plan.name}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#333", mb: 1 }}
                    >
                      ${plan.price}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "#666", fontWeight: 400 }}
                      >
                        /{plan.period}
                      </Typography>
                    </Typography>

                    <Box sx={{ textAlign: "left", mb: 3 }}>
                      {plan.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CheckCircle
                            sx={{ fontSize: 16, color: "#4caf50" }}
                          />
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant={plan.current ? "outlined" : "contained"}
                      fullWidth
                      disabled={plan.current}
                      onClick={() => handlePlanUpgrade(plan.id)}
                      sx={{
                        backgroundColor: plan.current
                          ? "transparent"
                          : "#ff6b35",
                        borderColor: plan.current ? "#ff6b35" : "#ff6b35",
                        color: plan.current ? "#ff6b35" : "white",
                        "&:hover": {
                          backgroundColor: plan.current
                            ? "rgba(255, 107, 53, 0.04)"
                            : "#e55a2b",
                        },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {plan.current
                        ? "Current Plan"
                        : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card> */}

      {/* Notification Settings */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Notifications sx={{ color: "#ff6b35" }} />
            Notification Preferences
          </Typography>

          <List sx={{ width: "100%" }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Email sx={{ color: "#666" }} />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive updates and important information via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.emailNotifications}
                  onChange={() =>
                    handleNotificationChange("emailNotifications")
                  }
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Sms sx={{ color: "#666" }} />
              </ListItemIcon>
              <ListItemText
                primary="SMS Notifications"
                secondary="Get text messages for order updates and urgent alerts"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.smsNotifications}
                  onChange={() => handleNotificationChange("smsNotifications")}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <Notifications sx={{ color: "#666" }} />
              </ListItemIcon>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive browser notifications for real-time updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.pushNotifications}
                  onChange={() => handleNotificationChange("pushNotifications")}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary="Order Updates"
                secondary="Notifications about order status, shipping, and delivery"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.orderUpdates}
                  onChange={() => handleNotificationChange("orderUpdates")}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary="Promotions & Offers"
                secondary="Special deals, discounts, and promotional content"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.promotions}
                  onChange={() => handleNotificationChange("promotions")}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary="Newsletter"
                secondary="Weekly newsletter with product updates and health tips"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.newsletter}
                  onChange={() => handleNotificationChange("newsletter")}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <ListItemText
                primary="Security Alerts"
                secondary="Important security notifications and account activity"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.securityAlerts}
                  onChange={() => handleNotificationChange("securityAlerts")}
                  color="primary"
                  disabled
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            Security alerts cannot be disabled for your account protection.
          </Alert>
        </CardContent>
      </Card>

      {/* Account & Privacy Settings */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Security sx={{ color: "#ff6b35" }} />
                Privacy & Security
              </Typography>

              <List sx={{ width: "100%" }}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemIcon>
                    <Shield sx={{ color: "#666" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#ff6b35",
                      color: "#ff6b35",
                      "&:hover": {
                        borderColor: "#e55a2b",
                        backgroundColor: "rgba(255, 107, 53, 0.04)",
                      },
                      textTransform: "none",
                    }}
                  >
                    Enable
                  </Button>
                </ListItem>

                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemIcon>
                    <Download sx={{ color: "#666" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Download Your Data"
                    secondary="Get a copy of your account information"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#ff6b35",
                      color: "#ff6b35",
                      "&:hover": {
                        borderColor: "#e55a2b",
                        backgroundColor: "rgba(255, 107, 53, 0.04)",
                      },
                      textTransform: "none",
                    }}
                  >
                    Request
                  </Button>
                </ListItem>

                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemIcon>
                    <Delete sx={{ color: "#f44336" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Delete Account"
                    secondary="Permanently remove your account and data"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ textTransform: "none" }}
                  >
                    Delete
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Palette sx={{ color: "#ff6b35" }} />
                Preferences
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                    startAdornment={<Language sx={{ mr: 1, color: "#666" }} />}
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="spanish">Español</MenuItem>
                    <MenuItem value="french">Français</MenuItem>
                    <MenuItem value="german">Deutsch</MenuItem>
                    <MenuItem value="italian">Italiano</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={theme}
                    label="Theme"
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, color: "#666" }}
              >
                Quick Actions
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CreditCard />}
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#ff6b35",
                      color: "#ff6b35",
                    },
                    textTransform: "none",
                    justifyContent: "flex-start",
                  }}
                >
                  Manage Payment Methods
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Verified />}
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#ff6b35",
                      color: "#ff6b35",
                    },
                    textTransform: "none",
                    justifyContent: "flex-start",
                  }}
                >
                  Verify Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#f44336", fontWeight: 600 }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This will:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: "#666" }}>
            <li>Remove all your personal information</li>
            <li>Cancel any active subscriptions</li>
            <li>Delete your order history</li>
            <li>Remove all saved addresses and preferences</li>
          </Box>
          <TextField
            fullWidth
            label="Type 'DELETE' to confirm"
            variant="outlined"
            sx={{ mt: 2 }}
            placeholder="DELETE"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
            onClick={() => setDeleteDialogOpen(false)}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
