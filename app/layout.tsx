import "./globals.css";
import ClientWrapper from "../components/ClientWrapper";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CraftID.in",
  description: "Where crafts come alive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative" suppressHydrationWarning>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}