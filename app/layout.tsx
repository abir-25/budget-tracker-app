import Logo from "@/components/Logo";
import RootProviders from "@/components/providers/RootProviders";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Abir Mahmud's App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <body className={inter.className}>
          {/* <Logo /> */}
          <RootProviders>
            <div className="relative flex h-screen w-full flex-col items-center justify-center">
              <div style={{ marginTop: "-60px" }}>{children}</div>
            </div>
          </RootProviders>

          {/* <header className="flex justify-end p-4">
            <UserButton showName />
          </header>
          <div className="relative flex h-screen w-full flex-col items-center justify-center">
            <Logo />
            <SignedOut>
              <SignIn routing="hash" />
            </SignedOut>
            <SignedIn>
              <div>{children}</div>
            </SignedIn>
          </div> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
