import type React from "react";
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import ClientLayout from "@/components/client-layout";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EZRM - Raw Materials Simplified",
  description: "Raw Materials Simplified",
  icons: {
    icon: [
      {
        url: "/ezrm.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/ezrm.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
    shortcut: "/ezrm.png",
    apple: [
      {
        url: "/ezrm.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
