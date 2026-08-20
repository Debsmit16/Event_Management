import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

// Using Outfit for that modern, geometric GenZ tech aesthetic
const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Manager Dashboard",
  description: "Create, manage, and discover amazing events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
