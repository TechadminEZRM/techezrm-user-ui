"use client";

import React from "react";
import Image from "next/image";
import { useCertificateListing } from "@/api/handlers";
import type { Certificate } from "@/api/services";

const getImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${process.env.NEXT_PUBLIC_API_URL}/${imageUrl}`;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

const CertificationCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => {
  const getCertificateLink = () => {
    const pdfAsset = certificate.assetsLinks.find((a) => a.fileType === "pdf");
    return pdfAsset?.url || "#";
  };

  const expired = isExpired(certificate.expiryDate);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-6 md:gap-12 w-full bg-white p-6 rounded-[46px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      {/* Logo */}
      <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
        <div className="relative w-[min(80vw,300px)] h-[min(80vw,300px)] sm:w-[min(50vw,350px)] sm:h-[min(50vw,350px)] md:w-[min(30vw,450px)] md:h-[min(30vw,450px)] lg:w-[min(25vw,450px)] lg:h-[min(25vw,450px)] flex items-center justify-center">
          <Image
            src={getImageUrl(certificate.bannerImage) || "/placeholder.svg"}
            alt={certificate.certificationName}
            fill
            style={{ objectFit: "contain" }}
            onError={(e) => { (e.target as HTMLImageElement).src = "/iso.png"; }}
            priority={false}
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, (max-width: 1200px) 30vw, 25vw"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center md:text-left min-w-0">
        <h3 className="font-semibold text-[#F9A922] text-[1.5rem] md:text-[1.75rem] mb-2 tracking-tight">{certificate.title}</h3>
        <p className="font-medium text-[#666] text-sm md:text-[1.5rem] mb-4 md:mb-5">{certificate.certificationName}</p>
        <p className="text-[#555] text-sm md:text-base leading-relaxed mb-4 md:mb-5 max-w-full md:max-w-[650px] mx-auto md:mx-0">{certificate.descr}</p>

        <div className="mb-4 md:mb-5 space-y-1">
          <p className="text-xs md:text-sm text-[#777]"><strong>Issued by:</strong> {certificate.issuedBy}</p>
          <p className="text-xs md:text-sm text-[#777]"><strong>Issue Date:</strong> {formatDate(certificate.issueDate)}</p>
          <p className={`text-xs md:text-sm font-medium ${expired ? "text-red-600" : "text-[#777]"}`}>
            <strong>Expiry Date:</strong> {formatDate(certificate.expiryDate)}{expired && " (Expired)"}
          </p>
          <p className="text-xs md:text-sm text-[#777]"><strong>Certificate ID:</strong> {certificate.certificateId}</p>
        </div>

        <a
          href={getCertificateLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#0066cc] hover:text-[#0052a3] hover:underline focus:outline focus:outline-[#0066cc] focus:outline-2 focus:outline-offset-2 focus:rounded-sm font-medium"
        >
          View Certificate ({certificate.assetsLinks.length} file{certificate.assetsLinks.length !== 1 ? "s" : ""})
        </a>
      </div>
    </div>
  );
};

const CertificationCardSkeleton: React.FC = () => (
  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 w-full bg-white p-6 rounded-[46px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
    <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
      <div className="w-[min(80vw,300px)] h-[min(80vw,300px)] md:w-[250px] md:h-[250px] bg-[#f0f0f0] rounded-lg animate-pulse" />
    </div>
    <div className="flex-1 text-center md:text-left">
      <div className="h-7 bg-[#f0f0f0] rounded w-3/5 mb-3 animate-pulse" />
      <div className="h-5 bg-[#f0f0f0] rounded w-4/5 mb-5 animate-pulse" />
      <div className="h-4 bg-[#f0f0f0] rounded w-full mb-2 animate-pulse" />
      <div className="h-4 bg-[#f0f0f0] rounded w-[90%] mb-2 animate-pulse" />
      <div className="h-4 bg-[#f0f0f0] rounded w-[70%] mb-5 animate-pulse" />
      <div className="h-3.5 bg-[#f0f0f0] rounded w-2/5 mb-1 animate-pulse" />
      <div className="h-3.5 bg-[#f0f0f0] rounded w-1/2 mb-1 animate-pulse" />
      <div className="h-3.5 bg-[#f0f0f0] rounded w-[45%] mb-5 animate-pulse" />
      <div className="h-3.5 bg-[#f0f0f0] rounded w-[30%] animate-pulse" />
    </div>
  </div>
);

const Certifications: React.FC = () => {
  const { data: response, isLoading, error, isError } = useCertificateListing({ limit: 3 });

  React.useEffect(() => {
    console.log("Certificates Loading:", isLoading);
    console.log("Certificates Error:", error);
    console.log("Certificates Response:", response);
  }, [isLoading, error, response]);

  const certificates = response?.data?.certifications || [];
  const displayedCertifications = certificates.slice(0, 3);

  return (
    <div className="w-full bg-[#fafafa] py-6 md:py-0">
      <div className="w-full px-0">
        <div className="bg-[#fafafa] rounded-lg p-6 md:p-8 min-h-[300px]">
          {/* Heading */}
          <h2 className="font-semibold text-[#1a1a1a] text-[1.75rem] md:text-[2rem] mb-6 md:mb-8 ml-8 tracking-tight">
            Certifications
            {!isLoading && certificates.length > 0 && (
              <span className="ml-4 text-[#666] text-base font-normal">({certificates.length} total)</span>
            )}
          </h2>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col gap-6 md:gap-8 mx-8">
              {Array.from({ length: 3 }).map((_, i) => <CertificationCardSkeleton key={i} />)}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="mx-8 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-semibold text-red-700">Error loading certifications</p>
              <p className="text-sm text-red-600">{error instanceof Error ? error.message : "Something went wrong"}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && certificates.length === 0 && (
            <div className="text-center py-8 mx-8">
              <p className="text-lg font-medium text-[#666] mb-1">No certifications found</p>
              <p className="text-sm text-[#999]">Certifications will appear here once they are available.</p>
            </div>
          )}

          {/* Cards */}
          {!isLoading && !isError && certificates.length > 0 && (
            <div className="flex flex-col gap-6 md:gap-8 mx-8">
              {displayedCertifications.map((certificate) => (
                <CertificationCard key={certificate._id} certificate={certificate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
