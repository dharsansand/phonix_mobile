import { Suspense } from "react";
import ProductCatalogueClient from "./ProductCatalogueClient";

// 🟢 1. Next.js SEO Metadata
export const metadata = {
  title: "Explore Mobile Accessories & Spares | Phonix Mobile",
  description:
    "Shop original smartphone accessories, GaN fast chargers, shockproof cases, 9H tempered glass, and OEM spare parts from Phonix Mobile in Periyar Colony, Tirupur.",
  keywords: [
    "Mobile Accessories Tirupur",
    "Fast Chargers Tirupur",
    "iPhone Cases Tirupur",
    "Tempered Glass Replacement",
    "Original Mobile Spare Parts",
    "Phonix Mobile Store",
  ],
  alternates: {
    canonical: "https://www.phonixmobile.store/product",
  },
  openGraph: {
    title: "Mobile Accessories & Spares Catalogue | Phonix Mobile",
    description:
      "Original chargers, rugged cases, audio gear, and replacement spares in Tirupur.",
    url: "https://www.phonixmobile.store/product",
    siteName: "Phonix Mobile",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
        width: 1200,
        height: 630,
        alt: "Phonix Mobile Accessories Collection",
      },
    ],
  },
};

export default function ProductsPage() {
  const catalogueSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Phonix Mobile Accessories & Spares Catalogue",
    url: "https://www.phonixmobile.store/product",
    description:
      "Explore genuine smartphone accessories, fast chargers, and replacement components by Phonix Mobile.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogueSchema) }}
      />
      <Suspense
        fallback={
          <div
            style={{ padding: "5rem", textAlign: "center", color: "#00d2ff" }}
          >
            Loading Phonix Mobile Products...
          </div>
        }
      >
        <ProductCatalogueClient />
      </Suspense>
    </>
  );
}
