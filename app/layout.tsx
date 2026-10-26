import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carcalc.app"),
  title: {
    default: "UK Car Ownership Cost Calculator | CarCalc",
    template: "%s | CarCalc",
  },
  description:
    "Estimate the cost of owning a car in the UK, including fuel, insurance, tax, maintenance and depreciation.",
  openGraph: {
    title: "UK Car Ownership Cost Calculator | CarCalc",
    description:
      "Estimate fuel, insurance, tax, maintenance and depreciation to understand your car's ownership cost.",
    type: "website",
    url: "https://carcalc.app",
  },
  verification: {
    google: "M6m2mPst28pU7jgnoQLczUgcSx7__5xAlxVjdiatLlo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}