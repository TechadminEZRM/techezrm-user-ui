"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Globe, FileText, MapPin, DollarSign, Users, Building2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import type { UpdateProfileRequest, CustomerProfile } from "@/api/services/customerProfile";

interface ProfileUpdateFormProps {
  customerId: string;
  initialData?: CustomerProfile;
  onSuccess?: (updatedProfile: CustomerProfile) => void;
}

const fieldClass =
  "flex h-10 w-full rounded-xl border border-line-light bg-paper px-4 py-2 text-sm text-heading placeholder:text-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:opacity-50";

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ customerId, initialData, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: "", phone: "", companyName: "", companyAddress: "",
    businessType: "", annualRevenue: "", employeeCount: "", website: "", description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) return;
      setLoading(true);
      setError("");
      try {
        const data = await customerProfileHandler.getProfile(customerId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError("Failed to load customer information. Please fill the form manually.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "", phone: profile.phone || "",
        companyName: profile.companyName || "", companyAddress: profile.companyAddress || "",
        businessType: profile.businessType || "", annualRevenue: profile.annualRevenue || "",
        employeeCount: profile.employeeCount || "", website: profile.website || "",
        description: profile.description || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) newErrors.phone = "Please enter a valid phone number";
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) newErrors.website = "Please enter a valid website URL (include http:// or https://)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const updatedProfile = await customerProfileHandler.updateProfile(customerId, formData);
      setSuccess(true);
      if (onSuccess) onSuccess(updatedProfile);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = ["Manufacturing", "Retail", "Wholesale", "Healthcare", "Technology", "Food & Beverage", "Cosmetics", "Pharmaceuticals", "Agriculture", "Other"];
  const revenueRanges = ["Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M", "$10M - $50M", "$50M+"];
  const employeeRanges = ["1-10", "11-50", "51-100", "101-250", "251-500", "501-1000", "1000+"];

  return (
    <div className="max-w-[1000px] mx-auto px-2">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-heading flex items-center gap-3 mb-1">
          <User className="w-6 h-6 text-brand" />
          Profile Information
        </h2>
        <p className="text-sm text-soft">Update your personal and business information to help us provide better service</p>
      </div>

      {success && <Alert variant="success" className="mb-6">Profile updated successfully!</Alert>}
      {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-brand" />
              <h3 className="font-semibold text-heading">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-soft mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                  <input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className={`${fieldClass} pl-9`}
                    placeholder="Full Name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-soft mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                  <input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`${fieldClass} pl-9`}
                    placeholder="Phone Number"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-brand" />
              <h3 className="font-semibold text-heading">Business Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-soft mb-1.5 block">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                  <input value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} className={`${fieldClass} pl-9`} placeholder="Company Name" />
                </div>
              </div>
              <div>
                <label className="text-sm text-soft mb-1.5 block">Business Type</label>
                <select value={formData.businessType} onChange={(e) => handleInputChange("businessType", e.target.value)} className={fieldClass}>
                  <option value="">Select Business Type</option>
                  {businessTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-soft mb-1.5 block">Company Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-soft" />
                  <textarea value={formData.companyAddress} onChange={(e) => handleInputChange("companyAddress", e.target.value)} rows={2} className={`${fieldClass} h-auto pl-9 pt-2`} placeholder="Company Address" />
                </div>
              </div>
              <div>
                <label className="text-sm text-soft mb-1.5 block">Annual Revenue</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                  <select value={formData.annualRevenue} onChange={(e) => handleInputChange("annualRevenue", e.target.value)} className={`${fieldClass} pl-9`}>
                    <option value="">Select Revenue Range</option>
                    {revenueRanges.map((range) => <option key={range} value={range}>{range}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-soft mb-1.5 block">Employee Count</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                  <select value={formData.employeeCount} onChange={(e) => handleInputChange("employeeCount", e.target.value)} className={`${fieldClass} pl-9`}>
                    <option value="">Select Employee Count</option>
                    {employeeRanges.map((range) => <option key={range} value={range}>{range}</option>)}
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-soft mb-1.5 block">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                  <input value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} className={`${fieldClass} pl-9`} placeholder="https://yourwebsite.com" />
                </div>
                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-soft mb-1.5 block">Business Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-soft" />
                  <textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} className={`${fieldClass} h-auto pl-9 pt-2`} placeholder="Describe your business..." />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-br from-brand to-brand-hover text-white font-medium px-8 py-3 rounded-xl text-sm hover:from-brand-hover hover:to-brand hover:-translate-y-px hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 transition-all min-w-[160px] justify-center"
          >
            {loading ? (
              <><Spinner size="sm" className="border-white border-t-transparent" /> Updating...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
