import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/cart/FloatingCartButton"; // Import Floating Cart Button

export const metadata: Metadata = {
  title: "CraftID.in",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <Navbar />
            {children}
        <Footer />
        <FloatingCartButton /> {/* This ensures the button stays across all pages */}
      </body>
    </html>
  );
}
