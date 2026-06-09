"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useCompanyDetails } from "@/hooks/use-company-details";

interface CompanyContactInfoProps {
  title?: string;
  showSalesTeam?: boolean;
}

const CompanyContactInfo: React.FC<CompanyContactInfoProps> = ({
  title = "Connect with us",
  showSalesTeam = true,
}) => {
  const { companyDetails, loading } = useCompanyDetails();

  return (
    <>
      <h3 className="text-xl font-bold text-body mb-6 mt-8">{title}</h3>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {showSalesTeam && (
          <Card className="flex-1">
            <CardContent className="p-6">
              <h4 className="text-base font-bold text-body mb-3">Sales Team</h4>
              <p className="text-sm text-dim leading-relaxed">
                Contact our sales team. Connect with one of the world&apos;s leading nutraceutical companies and explore how we can provide the right nutritional ingredients for your business.
              </p>
            </CardContent>
          </Card>
        )}
        <Card className="flex-1">
          <CardContent className="p-6">
            <h4 className="text-base font-bold text-body mb-3">Contact Information</h4>
            <p className="text-sm text-dim leading-relaxed">
              <strong>Address:</strong> {loading ? "Loading..." : companyDetails?.address || "The Old Smithy, 7 High Street, Merstham, Surrey, RH1 3BA, UK"}<br />
              <strong>Phone:</strong> {loading ? "Loading..." : companyDetails?.phone || "+44 (0) 203 696 2780"}<br />
              <strong>WhatsApp:</strong> 447418310099<br />
              <strong>Email:</strong> {loading ? "Loading..." : companyDetails?.email || "web@nutraceuticalsgroup.com"}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CompanyContactInfo;
