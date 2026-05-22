import "./globals.css";
import type {} from "react";

export const metadata = {
  title: "Mortgage Ready Coach",
  description: "Educational mortgage readiness platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
