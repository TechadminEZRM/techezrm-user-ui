"use client";

import React from "react";
import { User, ShoppingBag, MapPin, Settings, Lock, FileText, ClipboardList } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";

interface ProfileLayoutWrapperProps {
  children: React.ReactNode;
  title: string;
}

const menuItems = [
  { id: "account", label: "Account Overview", icon: User, path: "/profile/account" },
  { id: "rfq", label: "RFQ Management", icon: ClipboardList, path: "/profile/rfq-management" },
  { id: "addresses", label: "Address Management", icon: MapPin, path: "/profile/address-management" },
  { id: "orders", label: "Orders Management", icon: ShoppingBag, path: "/profile/orders-management" },
  { id: "settings", label: "Settings", icon: Settings, path: "/profile/settings" },
  { id: "change-password", label: "Change Password", icon: Lock, path: "/profile/change-password" },
];

const ProfileLayoutWrapper: React.FC<ProfileLayoutWrapperProps> = ({ children, title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { customer } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <div className="w-[280px] min-h-screen bg-white border-r border-[#e0e0e0] flex flex-col shadow-sm flex-shrink-0">
        {/* Profile Header */}
        <div className="p-6 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F9A922] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
              {customer?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-[#2c3e50] text-[0.95rem]">{customer?.name || "User"}</p>
              <p className="text-[#7f8c8d] text-[0.8rem]">{customer?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-colors ${
                  isActive
                    ? "bg-[#fff5f2] text-[#F9A922] font-semibold"
                    : "text-[#5a6c7d] hover:bg-[#f8f9fa] hover:text-[#2c3e50]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#F9A922]" : "text-[#7f8c8d]"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f8f9fa] overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e0e0e0] px-8 py-5">
          <h1 className="text-2xl font-semibold text-[#2c3e50]">{title}</h1>
        </div>
        {/* Content */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayoutWrapper;
