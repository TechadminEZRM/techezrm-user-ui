"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 1 },
        },
      })
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const storedToken = customerAuthService.getStoredToken();
    const storedCustomer = customerAuthService.getStoredCustomer();
    if (storedToken && storedCustomer) {
      setCustomer(storedCustomer);
    } else {
      clearCustomer();
    }
  }, [setCustomer, clearCustomer]);

  const hideNavbarFooterRoutes = ["/sign_in", "/register", "/sign-in", "/sign_up"];
  const shouldHideNavbarFooter = hideNavbarFooterRoutes.includes(pathname);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {!shouldHideNavbarFooter && <Navbar />}
      <main style={{ minHeight: shouldHideNavbarFooter ? "100vh" : "calc(100vh - 140px)" }}>
        {children}
      </main>
      {!shouldHideNavbarFooter && <FooterSection />}
      <ReactQueryDevtools initialIsOpen={false} />
      <ChatWidget />
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
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontFamily: "Poppins, sans-serif",
        }}
      />
    </QueryClientProvider>
  );
};

export default ClientLayout;
