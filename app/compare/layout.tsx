import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Car Ownership Costs",
  description:
    "Compare two UK cars side by side, including fuel, insurance, road tax, maintenance and estimated depreciation.",
};

export default function CompareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
