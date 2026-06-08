"use client";

import type React from "react";
import Hero from "@/components/Hero";
import FeaturedCategory from "@/components/FeaturedCategory";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServiceSection";
import FlashSaleSection from "@/components/FlashSaleSection";
import ProductsGridSection from "@/components/ProductsGridSection";
import ReviewsSection from "@/components/ReviewSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCategory />
      <ProductsSection />
      <ServicesSection />
      <FlashSaleSection />
      <ProductsGridSection />
      <ReviewsSection />
      <div className="bg-white h-16" />
    </div>
  );
};

export default HomePage;
