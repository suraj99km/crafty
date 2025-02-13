"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Hide footer on these pages
  const hideFooterPages = ["/cart"];
  const isProductPage = pathname.startsWith("/products/");

  return (
    <>
      {children}
      {!hideFooterPages.includes(pathname) && !isProductPage && <Footer />}
    </>
  );
};

export default LayoutWrapper;
