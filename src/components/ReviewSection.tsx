"use client";

import React from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useReviewListing } from "@/api/handlers";
import type { CustomerReview } from "@/api/services";

const getInitials = (name: string | undefined | null) => {
  if (!name || typeof name !== "string") return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const ReviewCard: React.FC<{ review: CustomerReview }> = ({ review }) => {
  const customerName = review.customer?.name || "Anonymous User";
  const productName = review.product?.name || "Unknown Product";

  return (
    <div className="bg-white rounded-2xl border border-transparent hover:border-line-light w-[380px] min-h-[320px] flex flex-col overflow-visible relative transition-all">
      {/* Thumb buttons on right edge */}
      <div className="absolute -right-5 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center z-10">
        <div className="relative">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-black/5 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all">
            <ThumbsUp className="w-[18px] h-[18px] text-brand" />
          </div>
          <div className="absolute -right-1.5 -top-1.5 w-5 h-5 bg-brand rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-white text-[0.7rem] font-semibold">{review.helpfulVotes || 0}</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-wash cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all">
          <ThumbsDown className="w-[18px] h-[18px] text-dim" />
        </div>
      </div>

      <div className="p-6 flex flex-col h-full">
        {/* Top row: Avatar, Product Name, Rating */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-base flex-shrink-0">
            {getInitials(customerName)}
          </div>
          <p className="font-semibold text-body text-[1.1rem] flex-1 mr-3">{productName}</p>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-[18px] h-[18px]" style={{ fill: i < (review.rating || 0) ? "var(--color-brand)" : "var(--color-line-light)", color: i < (review.rating || 0) ? "var(--color-brand)" : "var(--color-line-light)" }} />
            ))}
          </div>
        </div>

        {/* Title */}
        <p className="text-body font-semibold text-base mb-2 leading-snug">{review.title || "No title provided"}</p>

        {/* Review text */}
        <div className="flex-1 pr-6">
          <p
            className="text-dim text-sm leading-relaxed overflow-hidden"
            style={{ display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical" }}
          >
            {review.review || "No review text provided"}
          </p>
        </div>

        {/* Verified badge */}
        {review.isVerifiedPurchase && (
          <div className="mb-3">
            <span className="text-success text-xs font-semibold bg-success-light px-2 py-1 rounded">
              ✓ Verified Purchase
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-brand text-[0.9rem] font-medium">{formatDate(review.createdAt)}</span>
          <span className="text-body text-[0.9rem] font-medium">- {customerName}</span>
        </div>
        <p className="text-faint text-xs mt-1 text-center">Order: {review.order || "N/A"}</p>
      </div>
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  const { data: response, isLoading, error, isError } = useReviewListing({ page: 1, pageSize: 3, status: "published" });

  React.useEffect(() => {
    console.log("Reviews Loading:", isLoading);
    console.log("Reviews Error:", error);
    console.log("Reviews Response:", response);
  }, [isLoading, error, response]);

  const SectionTitle = ({ total }: { total?: number }) => (
    <div className="text-center mb-20">
      <h2 className="text-[2rem] md:text-[2.5rem] font-semibold text-[#2c5530] relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-brand after:rounded-full">
        Reviews{total !== undefined ? ` (${total})` : ""}
      </h2>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-paper py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle />
          <div className="flex justify-center py-8"><Spinner size="lg" /></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-paper py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle />
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            <p className="font-semibold">Error loading reviews</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </div>
        </div>
      </div>
    );
  }

  const reviews = response?.data?.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="bg-paper py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle />
          <p className="text-dim text-center text-lg">No reviews available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle total={response?.data?.total} />
        <div className="flex gap-10 justify-center mb-20 flex-wrap lg:flex-nowrap">
          {reviews.map((review: CustomerReview) => <ReviewCard key={review._id} review={review} />)}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
