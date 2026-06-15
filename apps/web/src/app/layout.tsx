import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import Providers from "@/components/providers";
import { AmazonFooter } from "@/components/shared/AmazonFooter";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Amazon 2nd Chance",
  description: "Give products a second chance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`h-full antialiased ${nunito.variable}`}
      >
        <body className="min-h-full flex flex-col bg-[#f2f2f2] text-amazon-black font-sans">
          <Providers>
            <div className="flex-1 flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
              <AmazonFooter />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
