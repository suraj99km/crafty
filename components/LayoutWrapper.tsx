"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Pages where Navbar and Footer should be hidden
  const hideFooterPages = ["/cart", "/login","/cart/checkout","/join-as-artist","/list-product", "/list-product/preview", "/join-as-artist/welcome"];
  const isProductPage = pathname.startsWith("/products/");
  const hideNavbarPages = ["/login", "/join-as-artist/welcome"]; // Hide navbar on login page

  return (
    <>
      {!hideNavbarPages.includes(pathname) && <Navbar />}
      {children}
      {!hideFooterPages.includes(pathname) && !isProductPage && <Footer />}
    </>
  );
};

export default LayoutWrapper;
