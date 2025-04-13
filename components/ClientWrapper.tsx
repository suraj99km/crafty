'use client';

import { Toaster } from "sonner";
import LayoutWrapper from "./LayoutWrapper";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}