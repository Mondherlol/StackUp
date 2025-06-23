import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stack Up",
  description: "Organize your stocks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`} // Ajout de flex
      >
        <AuthProvider>
          <Navbar />
          <Sidebar />
          <main className="flex-1">
            <Toaster />
            {children}
          </main>{" "}
          {/* Allows the content to take the remaining space */}
        </AuthProvider>
      </body>
    </html>
  );
}
