"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ChatWidget from "@/components/ChatWidget";
import { useAppStore } from "@/store/use-app-store";
import { customerAuthService } from "@/api/services/customerAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { setCustomer, clearCustomer } = useAppStore();

  // Create QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  // Handle hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    // Check for stored authentication data on mount
    const storedToken = customerAuthService.getStoredToken();
    const storedCustomer = customerAuthService.getStoredCustomer();

    if (storedToken && storedCustomer) {
      // Restore authentication state
      setCustomer(storedCustomer);
    } else {
      // Clear any invalid state
      clearCustomer();
    }
  }, [setCustomer, clearCustomer]);

  // Define routes where navbar and footer should be hidden
  const hideNavbarFooterRoutes = [
    "/sign_in",
    "/register",
    "/sign-in",
    "/sign_up",
  ];
  const shouldHideNavbarFooter = hideNavbarFooterRoutes.includes(pathname);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* Conditionally render Navbar */}
        {!shouldHideNavbarFooter && <Navbar />}

        {/* Main content area with dynamic min-height */}
        <main
          style={{
            minHeight: shouldHideNavbarFooter ? "100vh" : "calc(100vh - 140px)",
          }}
        >
          {children}
        </main>

        {/* Conditionally render Footer */}
        {!shouldHideNavbarFooter && <FooterSection />}

        {/* React Query DevTools */}
        <ReactQueryDevtools initialIsOpen={false} />

        {/* Chat Widget - Available on all pages */}
        <ChatWidget />

        {/* Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontSize: "0.875rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ClientLayout;
