// src/app/(public)/product/[id]/page.jsx
import ProductDetailClient from "./ProductDetailClient";

// 🟢 Server fetcher for SEO & Pre-rendering
async function fetchProductForSeo(identifier) {
  if (!identifier || identifier.trim() === "") return null;

  // const baseUrl = "http://localhost:5000/api";
  const baseUrl = "https://ecom-website-wg9j.onrender.com/api";

  try {
    const cleanId = decodeURIComponent(identifier).trim();
    console.log("🟢 [Server SEO] Fetching for cleanId:", cleanId);

    const res = await fetch(
      `${baseUrl}/product/viewproduct/${encodeURIComponent(cleanId)}`,
      {
        cache: "no-store", // Guarantees fresh data
      },
    );

    if (!res.ok) {
      console.error(`🔴 [Server SEO] Fetch failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data?.product || data || null;
  } catch (e) {
    console.error("🔴 [Server SEO] Fetch error:", e);
    return null;
  }
}

// 🟢 1. Next.js App Router Dynamic SEO Metadata Generator
export async function generateMetadata({ params }) {
  // 🟢 Await params (Required in Next.js 15)
  const resolvedParams = await params;
  const rawId = resolvedParams?.id || "";
  const identifier = decodeURIComponent(rawId);

  const product = await fetchProductForSeo(identifier);

  if (!product) {
    return {
      title: "Product Not Found | Abc Classic",
      description: "The requested traditional metal vessel could not be found.",
    };
  }

  const metaTitle =
    product.meta_title || `${product.name} | Abc Classic Traditional Metalware`;
  const metaDesc =
    product.meta_description ||
    `Shop ${product.name} handcrafted by master artisans. Heavy-gauge pure metal vessels by Abc Classic.`;
  const metaKeywords =
    product.meta_keywords ||
    `${product.name}, Abc Classic, Traditional Metalware, Copper, Brass`;

  const primaryImage =
    product.productImage?.[0] ||
    product.variants?.[0]?.images?.[0] ||
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&auto=format&fit=crop&q=80";

  const canonicalUrl = `https://abcclassic.com/product/${encodeURIComponent(identifier)}`;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords:
      typeof metaKeywords === "string"
        ? metaKeywords.split(",").map((k) => k.trim())
        : [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "Abc Classic",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [primaryImage],
    },
  };
}

// 🟢 2. Page Component (Server)
export default async function Page({ params }) {
  // 🟢 Await params here as well
  const resolvedParams = await params;
  const rawId = resolvedParams?.id || "";
  const identifier = decodeURIComponent(rawId);

  const product = await fetchProductForSeo(identifier);

  // Schema.org Product Rich Snippet
  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.productImage || [],
        description:
          product.meta_description || product.content || product.name,
        brand: {
          "@type": "Brand",
          name: "Abc Classic",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.price || 0,
          availability:
            (product.initial_stock || 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `https://abcclassic.com/product/${encodeURIComponent(identifier)}`,
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {/* Passes server pre-rendered product directly to client UI */}
      <ProductDetailClient initialProduct={product} identifier={identifier} />
    </>
  );
}
