"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/componses/heading";
import Loader from "@/app/componses/Loader";
import Footer from "../componses/Footer";

export default function PublicLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // keep this short
    return () => clearTimeout(timer);
  }, []);

  const overlay = loading ? (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#090d16",
      }}
    >
      <Loader />
    </div>
  ) : null;

  if (isLoginPage) {
    return (
      <>
        {overlay}
        <main
          style={{
            minHeight: "100vh",
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
      </>
    );
  }

  return (
    <div style={{ backgroundColor: "#1b1f2b", minHeight: "100vh" }}>
      {overlay}
      <Header />
      <main
        style={{
          paddingTop: "110px",
          minHeight: "100vh",
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
