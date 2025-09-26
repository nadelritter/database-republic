import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Database Republic",
  description: "Tracking added and removed stocks from Trade Republic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-[#121212] text-white`}>
        <div className="flex min-h-screen">
          <Sidebar />
          {/* Added 'min-w-0' to allow this column to shrink */}
          <main className="flex-1 px-4 py-8 md:px-8 min-w-0">{children}</main>
          <RightSidebar />
        </div>
      </body>
    </html>
  );
}


