import React from "react";
import ProfileSidebar from "./ProfileSidebar";

interface ProfileLayoutProps {
  customer: any;
  currentPage: string;
  onPageChange: (page: "profile" | "orders" | "addresses" | "settings" | "change-password" | "edit-profile" | "rfqs") => void;
  onBackToProfile: () => void;
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  customer,
  currentPage,
  onPageChange,
  onBackToProfile,
  title,
  children,
  showBackButton = false,
}) => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Left Sidebar */}
      <ProfileSidebar customer={customer} currentPage={currentPage} onPageChange={onPageChange} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
