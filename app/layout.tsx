import "./globals.css";
import { ppEditorialNewUltralightItalic, inter } from "./fonts";
import type React from "react";
import { QueryProvider } from "@/hooks/use-universities";

export const metadata = {
  title: "Review University in the Philippines",
  description: "Review University in the Philippines",
};

export const dynamic = "force-static";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
