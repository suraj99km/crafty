import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LayoutWrapper from "@/components/LayoutWrapper"; // Ensure CartProvider is included

export const metadata: Metadata = {
  title: "CraftID.in",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
        <body className="relative">
          <Navbar />
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </html>
  );
}
