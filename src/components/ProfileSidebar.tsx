import React from "react";
import { User, ShoppingBag, Lock, Settings, Briefcase, MapPin } from "lucide-react";

interface ProfileSidebarProps {
  customer: any;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ customer, currentPage, onPageChange }) => {
  const menuItems = [
    { id: "profile", label: "My Accounts", icon: User, handler: () => onPageChange("profile") },
    { id: "addresses", label: "Address Management", icon: MapPin, handler: () => onPageChange("addresses") },
    { id: "orders", label: "My Orders", icon: ShoppingBag, handler: () => onPageChange("orders") },
    { id: "rfqs", label: "My RFQs", icon: Briefcase, handler: () => onPageChange("rfqs") },
    { id: "change-password", label: "Change Password", icon: Lock, handler: () => onPageChange("change-password") },
    { id: "settings", label: "Settings", icon: Settings, handler: () => onPageChange("settings") },
  ];

  return (
    <div className="w-full md:w-[280px] bg-white border-r border-line-light flex flex-col">
      {/* Profile Header */}
      <div className="p-6 border-b border-wash">
        <h2 className="text-base font-semibold text-body mb-0.5">Profile</h2>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-wash flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <p className="text-sm text-dim mb-0.5">Hello</p>
          <p className="text-base font-semibold text-body mb-0.5">{customer?.name}</p>
          <p className="text-sm text-dim">Personal Information</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={item.handler}
              className={`w-full flex items-center gap-4 px-6 py-[14px] cursor-pointer transition-colors text-left ${
                isActive
                  ? "bg-brand text-white border-r-[3px] border-r-brand"
                  : "text-dim hover:bg-gray-50"
              }`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span className={`text-[15px] ${isActive ? "font-semibold" : "font-normal"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSidebar;
