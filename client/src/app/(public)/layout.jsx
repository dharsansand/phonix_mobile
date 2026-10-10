"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/app/componses/Loader";

// 1. Dynamically load the Header
const Header = dynamic(() => import("@/app/componses/heading"), {
  ssr: true,
});

// 2. Dynamically load the Footer
const Footer = dynamic(() => import("../componses/Footer"), {
  ssr: true,
});

export default function PublicLayout({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  // IMPORTANT: Keep the artificial 2s timer REMOVED.
  // If you need a loader, only use it for data fetching.

  if (isLoginPage) {
    return (
      <main
        style={
          {
            /* your login styles */
          }
        }
      >
        {children}
      </main>
    );
  }

  return (
    <div style={{ backgroundColor: "#1b1f2b", minHeight: "100vh" }}>
      <Header />
      <main
        style={
          {
            /* your main styles */
          }
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
