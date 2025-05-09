import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "TheraMind",
  description: "Your mindfulness app",
  icons: {
    icon: "/images/logo/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`} suppressHydrationWarning>
        {/* Mobile container with fixed width */}
        <div className="mobile-container max-w-md mx-auto">
          <header className="flex justify-center"></header>
          {children}
        </div>
      </body>
    </html>
  );
}
