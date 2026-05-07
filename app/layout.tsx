"use client"
import { AuthProvider } from "@/components/context/AuthProvider";
import "./globals.css";
import { Toaster } from "sonner";
import { AllCommunityModule } from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';
import { Lato } from "next/font/google"

const lato = Lato({
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
    variable: "--font-lato",
})

const modules = [AllCommunityModule];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={` h-full antialiased ${lato.variable}`}
    >
      <body className={`min-h-full flex flex-col ${lato.variable} font-lato`}>
        <AuthProvider>
          <AgGridProvider modules={modules}>
            {children}
          </AgGridProvider>
        </AuthProvider>
        <Toaster/>
      </body>
    </html>
  );
}
