"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Pages where Navbar and Footer should be hidden
  const hideFooterPages = ["/cart", "/login","/cart/checkout","/join-as-artist"];
  const isProductPage = pathname.startsWith("/products/");
  const hideNavbarPages = ["/login"]; // Hide navbar on login page

  return (
    <>
      {!hideNavbarPages.includes(pathname) && <Navbar />}
      {children}
      {!hideFooterPages.includes(pathname) && !isProductPage && <Footer />}
    </>
  );
};

export default LayoutWrapper;
