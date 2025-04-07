import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { AuthStateProvider } from '@/context/AuthContext';


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}}}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthStateProvider>
        {children}
        </AuthStateProvider>
      </body>
    </html>
  );
}
