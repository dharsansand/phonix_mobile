"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/componses/heading";
import Loader from "@/app/componses/Loader";
import Footer from "../componses/Footer";

export default function PublicLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Check if currently on /login page
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // 🟢 1. LOGIN PAGE (Dark Midnight Theme)
  if (isLoginPage) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#090d16",
          background:
            "radial-gradient(circle at 50% 0%, #121826 0%, #090d16 100%)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </main>
    );
  }

  return (
    <div style={{ backgroundColor: "#1b1f2b", minHeight: "100vh" }}>
      <Header />
      <main
        style={{
          paddingTop: "110px",
          minHeight: "100vh",
          backgroundColor: "#1f2430",
          background:
            "radial-gradient(circle at 50% -10%, #162032 0%, #090d16 50%)",
          color: "#ffffff",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
