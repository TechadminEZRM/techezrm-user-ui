"use client";

import React, { useState, useEffect } from "react";
import { UserCircle, Briefcase, Phone, Mail, Building2, DollarSign, Users, Globe, FileText, MapPin } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import { useAppStore } from "@/store/use-app-store";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import { CustomerProfile } from "@/api/services/customerProfile";

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-5 h-5 text-soft flex-shrink-0" />
    <div>
      <p className="text-soft text-[0.7rem] font-semibold uppercase tracking-[0.5px]">{label}</p>
      <p className="text-heading text-[0.9rem] font-medium">{value || "Not provided"}</p>
    </div>
  </div>
);

const SectionCard = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="p-6 rounded-xl border border-wash bg-paper h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 rounded-lg bg-gradient-to-br from-brand to-brand-hover text-white">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="font-semibold text-heading text-[1.1rem]">{title}</h2>
    </div>
    <div className="flex flex-col gap-5">{children}</div>
  </div>
);

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
          <div className="flex justify-center py-8">
            <p className="text-heading">Loading...</p>
          </div>
        </ProfileLayoutWrapper>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Account Overview">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(249,169,34,0.1)", background: "linear-gradient(135deg,#ffffff 0%,var(--color-paper) 100%)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-brand-hover to-brand" />

            {/* Header */}
            <div className="relative p-8 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-hover) 100%)" }}>
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
              <div className="relative z-[1] flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/20 border-[3px] border-white/30 backdrop-blur-[10px] flex items-center justify-center text-3xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h1 className="font-bold text-[1.8rem] mb-1" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    {profile?.name || "User Name"}
                  </h1>
                  <p className="text-white/90 text-base mb-4">{customer?.email || "user@example.com"}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 border border-white/30 backdrop-blur-[10px]">
                    Active Account
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <SectionCard icon={UserCircle} title="Personal Information">
                    <InfoRow icon={Phone} label="Phone Number" value={profile?.phone} />
                    <InfoRow icon={Mail} label="Email Address" value={customer?.email} />
                  </SectionCard>
                </div>
                <div className="flex-1">
                  <SectionCard icon={Briefcase} title="Business Information">
                    <InfoRow icon={Building2} label="Company Name" value={profile?.companyName} />
                    <InfoRow icon={Briefcase} label="Business Type" value={profile?.businessType} />
                    <InfoRow icon={DollarSign} label="Annual Revenue" value={profile?.annualRevenue} />
                    <InfoRow icon={Users} label="Employee Count" value={profile?.employeeCount ? `${profile.employeeCount} employees` : null} />
                    {profile?.website && <InfoRow icon={Globe} label="Website" value={profile.website} />}
                  </SectionCard>
                </div>
              </div>

              {profile?.companyAddress && (
                <div className="mb-6">
                  <SectionCard icon={MapPin} title="Company Address">
                    <p className="text-heading text-[0.9rem] leading-relaxed font-medium">{profile.companyAddress}</p>
                  </SectionCard>
                </div>
              )}

              {profile?.description && (
                <SectionCard icon={FileText} title="Business Description">
                  <p className="text-heading text-[0.9rem] leading-relaxed font-medium">{profile.description}</p>
                </SectionCard>
              )}
            </div>
          </div>
        </div>
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default AccountOverviewPage;
