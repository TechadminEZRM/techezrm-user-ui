"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Search, Heart, ShoppingCart, User, LogOut, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { useCustomerLogout } from "@/api/handlers";
import { useCartSummary } from "@/api/handlers/cartHandler";
import { useWishlist } from "@/api/handlers/wishlistHandler";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { searchSuggestionService } from "@/api/services/searchSuggestionService";
import { Button } from "./ui/button";

interface SearchResult {
  id: string;
  title: string;
  type: string;
}

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const router = useRouter();
  const { customer, isAuthenticated } = useAppStore();
  const logoutMutation = useCustomerLogout();
  const { companyDetails } = useCompanyDetails();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await searchSuggestionService.getSuggestions({ q: searchQuery });
        if (res.success && Array.isArray(res.data)) {
          const formatted: SearchResult[] = [];
          res.data.forEach((item: any) => {
            if (Array.isArray(item.suggestions) && item.suggestions.length > 0) {
              item.suggestions.forEach((s: any) => {
                formatted.push({ id: s.id, title: s.title, type: item.type });
              });
            }
          });
          setSearchResults(formatted);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: cartSummary } = useCartSummary(customer?.id || "", {
    enabled: isAuthenticated && !!customer?.id,
  });
  const { data: wishlistData } = useWishlist(
    { customerId: customer?.id || "" },
    { enabled: isAuthenticated && !!customer?.id }
  );

  const cartCount = cartSummary?.data?.itemCount || 0;
  const wishlistCount = wishlistData?.data?.products?.length || 0;

  const handleSignInClick = () => router.push("/sign_in");
  const handleFavouriteClick = () => router.push("/favourite");
  const handleCartClick = () => router.push("/cart");

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setTimeout(() => {
      if (query.trim()) {
        const filtered = searchResults.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "product") {
      router.push(`/product/detail/${result.id}`);
    } else {
      router.push(`product?category=${result.title.toLowerCase()}`);
    }
    setIsSearchExpanded(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    router.push("/profile");
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const toolsLinks = [
    { label: "E Numbers", href: "/tools/e-numbers" },
    { label: "Capsule Sizes", href: "/tools/capsule-sizes" },
    { label: "Dietary Reference Values (NRV RDA)", href: "/tools/dietary-reference-values" },
    { label: "Enzyme Applications, Units and Info", href: "/tools/enzyme-applications" },
    { label: "Health Claims - EFSA", href: "/tools/health-claims" },
    { label: "Mineral Activity and Solubility in Water", href: "/tools/mineral-activity" },
    { label: "Scoville Heat Units", href: "/tools/scoville-heat-units" },
    { label: "Vitamin Activity", href: "/tools/vitamin-activity" },
  ];

  return (
    <header className="py-2 bg-brand w-full">
      <div className="flex items-center justify-between px-4 md:px-6 min-h-[64px] md:min-h-[70px]">
        {/* Logo */}
        <Link href="/" passHref>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ezrm-logo.png"
            alt={`${companyDetails?.fullName || "EZRM"} - Raw Materials Simplified`}
            className="h-8 md:h-16 w-auto cursor-pointer mix-blend-multiply"
          />
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          {/* Navigation Links - Hidden on mobile */}
          {!isMobile && (
            <div className="flex gap-6 items-center relative">
              {/* About */}
              <Link href="/about" passHref>
                <span className="text-base font-medium cursor-pointer whitespace-nowrap transition-all">
                  About
                </span>
              </Link>

              {/* Product */}
              <Link href="/product" passHref>
                <span className="text-base font-medium cursor-pointer whitespace-nowrap transition-all">
                  Product
                </span>
              </Link>

              {/* Tools with Dropdown */}
              <div
                ref={toolsMenuRef}
                className="relative"
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
              >
                <span className="text-base font-medium cursor-pointer whitespace-nowrap flex items-center gap-1 transition-all">
                  Tools
                  <ChevronDown className="w-4 h-4" />
                </span>

                {isToolsOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-line-light min-w-[280px] py-1 z-50">
                    {toolsLinks.map((tool) => (
                      <button
                        key={tool.href}
                        onClick={() => { setIsToolsOpen(false); router.push(tool.href); }}
                        className="w-full text-left py-3 px-4 text-sm font-medium text-heading hover:bg-gray-50 transition-colors"
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications */}
              <Link href="/certifications" passHref>
                <span className="text-base font-medium cursor-pointer whitespace-nowrap transition-all">
                  Certifications
                </span>
              </Link>

              {/* Inline Search Bar */}
              {isSearchExpanded && (
                <div className="ml-3 relative">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 w-4 h-4 text-gray-500" />
                      <input
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search for products, categories..."
                        autoFocus
                        className="w-[320px] h-9 bg-white rounded-lg border border-line-light pl-9 pr-9 text-sm text-body placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      />
                      {searchQuery && (
                        <Button
                          type="button"
                          onClick={handleSearchClear}
                          className="absolute right-3 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </form>

                  {/* Search Results Dropdown */}
                  {(searchResults.length > 0 || isSearching) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-line-light max-h-[300px] overflow-auto z-[1000]">
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                      ) : (
                        <ul className="py-0">
                          {searchResults.map((result) => (
                            <li
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                            >
                              <span className="text-sm font-medium text-heading">{result.title}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded border ${result.type === "product"
                                  ? "text-brand border-brand"
                                  : "text-blue-500 border-blue-400"
                                  }`}
                              >
                                {result.type}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            {/* Search toggle */}
            <Button
              onClick={handleSearchToggle}
              className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Wishlist */}
            <div className="relative">
              <Button
                onClick={handleFavouriteClick}
                className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </Button>
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute top-[15%] right-[15%] translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-brand to-brand-hover text-[10px] font-bold min-w-[18px] h-[18px] rounded-full border-2 border-white shadow-md flex items-center justify-center z-10">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <Button
                onClick={handleCartClick}
                className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </Button>
              {isAuthenticated && cartCount > 0 && (
                <span className="absolute top-[15%] right-[15%] translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-brand to-brand-hover text-[10px] font-bold min-w-[18px] h-[18px] rounded-full border-2 border-white shadow-md flex items-center justify-center z-10">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>

            {/* Profile or Sign In */}
            {isAuthenticated && customer ? (
              <div ref={profileMenuRef} className="relative">
                {/* Profile Dropdown Button */}
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 bg-white text-brand font-semibold text-sm px-3 py-2 ml-1 cursor-pointer rounded-lg min-w-[120px] transition-all hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="w-6 h-6 rounded-full bg-brand text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
                    {getInitials(customer.name)}
                  </div>
                  <span className="max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {customer.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 min-w-[200px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-wash z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-wash">
                      <p className="text-sm font-semibold text-body mb-0.5">{customer.name}</p>
                      <p className="text-xs text-dim">{customer.email}</p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-body hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      My Profile
                    </button>
                    <hr className="border-line my-1" />
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In Button */
              <div
                onClick={handleSignInClick}
                className="relative ml-1 min-w-[90px] cursor-pointer bg-white px-6 py-2 text-center text-sm font-bold text-brand transition-all hover:scale-[1.02] hover:bg-gray-50 active:scale-[0.98] [clip-path:polygon(0%_0%,calc(100%_-_15px)_0%,100%_50%,calc(100%_-_15px)_100%,0%_100%,15px_50%)]"
              >
                SIGN IN
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
