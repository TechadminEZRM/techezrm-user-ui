"use client";

import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Shield, Globe, Palette, CreditCard, CheckCircle2, Download, Trash2, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  securityAlerts: boolean;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F9A922] disabled:opacity-50 disabled:cursor-not-allowed ${checked ? "bg-[#F9A922]" : "bg-gray-200"}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true, smsNotifications: false, pushNotifications: true,
    orderUpdates: true, promotions: false, newsletter: true, securityAlerts: true,
  });
  const [language, setLanguage] = useState("english");
  const [theme, setTheme] = useState("light");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { key: "emailNotifications" as const, icon: Mail, label: "Email Notifications", desc: "Receive updates and important information via email" },
    { key: "smsNotifications" as const, icon: MessageSquare, label: "SMS Notifications", desc: "Get text messages for order updates and urgent alerts" },
    { key: "pushNotifications" as const, icon: Bell, label: "Push Notifications", desc: "Receive browser notifications for real-time updates" },
  ];

  const contentItems = [
    { key: "orderUpdates" as const, label: "Order Updates", desc: "Notifications about order status, shipping, and delivery" },
    { key: "promotions" as const, label: "Promotions & Offers", desc: "Special deals, discounts, and promotional content" },
    { key: "newsletter" as const, label: "Newsletter", desc: "Weekly newsletter with product updates and health tips" },
    { key: "securityAlerts" as const, label: "Security Alerts", desc: "Important security notifications and account activity", disabled: true },
  ];

  return (
    <div className="max-w-[1000px] mx-auto p-6">
      <div className="mb-8">
        <p className="text-[#666]">Manage your account preferences, subscription, and notifications</p>
      </div>

      {/* Notification Settings */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 font-semibold text-lg mb-6">
            <Bell className="w-5 h-5 text-[#F9A922]" />
            Notification Preferences
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {notificationItems.map(({ key, icon: Icon, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-[#666]" />
                  <div>
                    <p className="text-sm font-medium text-[#1F2A44]">{label}</p>
                    <p className="text-xs text-[#666]">{desc}</p>
                  </div>
                </div>
                <ToggleSwitch checked={notifications[key]} onChange={() => handleNotificationChange(key)} />
              </div>
            ))}

            <hr className="border-[#E5E7EB] my-2" />

            {contentItems.map(({ key, label, desc, disabled }) => (
              <div key={key} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#1F2A44]">{label}</p>
                  <p className="text-xs text-[#666]">{desc}</p>
                </div>
                <ToggleSwitch checked={notifications[key]} onChange={() => handleNotificationChange(key)} disabled={disabled} />
              </div>
            ))}
          </div>

          <Alert variant="default" className="mt-4">Security alerts cannot be disabled for your account protection.</Alert>
        </CardContent>
      </Card>

      {/* Account & Privacy + Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy & Security */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-2 font-semibold text-lg mb-6">
              <Shield className="w-5 h-5 text-[#F9A922]" />
              Privacy & Security
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#666]" />
                  <div>
                    <p className="text-sm font-medium text-[#1F2A44]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#666]">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="text-sm border border-[#F9A922] text-[#F9A922] px-3 py-1.5 rounded-[30px] hover:bg-[#FFFAF1] transition-colors">Enable</button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[#666]" />
                  <div>
                    <p className="text-sm font-medium text-[#1F2A44]">Download Your Data</p>
                    <p className="text-xs text-[#666]">Get a copy of your account information</p>
                  </div>
                </div>
                <button className="text-sm border border-[#F9A922] text-[#F9A922] px-3 py-1.5 rounded-[30px] hover:bg-[#FFFAF1] transition-colors">Request</button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-[#1F2A44]">Delete Account</p>
                    <p className="text-xs text-[#666]">Permanently remove your account and data</p>
                  </div>
                </div>
                <button onClick={() => setDeleteDialogOpen(true)} className="text-sm border border-red-500 text-red-500 px-3 py-1.5 rounded-[30px] hover:bg-red-50 transition-colors">Delete</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-2 font-semibold text-lg mb-6">
              <Palette className="w-5 h-5 text-[#F9A922]" />
              Preferences
            </div>
            <div className="mb-4">
              <label className="text-sm text-[#7f8c8d] mb-1.5 block">Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white pl-9 pr-4 text-sm text-[#1F2A44] focus:outline-none focus:ring-2 focus:ring-[#F9A922]">
                  <option value="english">English</option>
                  <option value="spanish">Español</option>
                  <option value="french">Français</option>
                  <option value="german">Deutsch</option>
                  <option value="italian">Italiano</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-sm text-[#7f8c8d] mb-1.5 block">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1F2A44] focus:outline-none focus:ring-2 focus:ring-[#F9A922]">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            <p className="text-xs font-semibold text-[#666] mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 border border-[#e0e0e0] text-[#666] px-4 py-2.5 rounded-xl text-sm hover:border-[#F9A922] hover:text-[#F9A922] transition-colors text-left">
                <CreditCard className="w-4 h-4" /> Manage Payment Methods
              </button>
              <button className="flex items-center gap-2 border border-[#e0e0e0] text-[#666] px-4 py-2.5 rounded-xl text-sm hover:border-[#F9A922] hover:text-[#F9A922] transition-colors text-left">
                <BadgeCheck className="w-4 h-4" /> Verify Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive" className="mb-4">
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <p className="text-sm text-[#1F2A44] mb-4">Are you sure you want to delete your account? This will:</p>
          <ul className="list-disc pl-5 text-sm text-[#666] space-y-1 mb-4">
            <li>Remove all your personal information</li>
            <li>Cancel any active subscriptions</li>
            <li>Delete your order history</li>
            <li>Remove all saved addresses and preferences</li>
          </ul>
          <input className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1F2A44] focus:outline-none focus:ring-2 focus:ring-[#F9A922] mt-2" placeholder="Type 'DELETE' to confirm" />
          <DialogFooter className="mt-4 gap-2">
            <button onClick={() => setDeleteDialogOpen(false)} className="px-4 py-2 text-sm text-[#666] rounded-[30px] border border-[#E5E7EB] hover:bg-gray-50">Cancel</button>
            <button onClick={() => setDeleteDialogOpen(false)} className="px-4 py-2 text-sm text-white bg-red-600 rounded-[30px] hover:bg-red-700">Delete Account</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
