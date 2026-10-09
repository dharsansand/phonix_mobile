// src/app/(public)/product/[id]/page.jsx
import ProductDetailClient from "./ProductDetailClient";

// 🟢 Server fetcher for SEO & Pre-rendering
async function fetchProductForSeo(identifier) {
  if (!identifier || identifier.trim() === "") return null;

  // const baseUrl = "http://localhost:5000/api";
  const baseUrl = "https://phonix-mobile.onrender.com/api";

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
      title: "Product Not Found | Phonix Mobile",
      description: "The requested product could not be found.",
    };
  }

  const metaTitle = product.meta_title || `${product.name} | Phonix Mobile`;
  const metaDesc =
    product.meta_description ||
    `Shop ${product.name} at Phonix Mobile in Tirupur.`;
  const metaKeywords =
    product.meta_keywords ||
    `${product.name}, Phonix Mobile Accessories, Tirupur Mobile Spares, OEM Replacement Parts, Fast Chargers, iPhone Cases, Tempered Glass`;

  const primaryImage =
    product.productImage?.[0] ||
    product.variants?.[0]?.images?.[0] ||
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&auto=format&fit=crop&q=80";

  const canonicalUrl = `https://www.phonixmobile.store/product/${encodeURIComponent(identifier)}`;

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
      siteName: "Phonix Mobile",
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
          name: "Phonix Mobile",
        },
        // 🟢 FIX 1: Ensure price is a NUMBER, not a string with "₹"
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price:
            typeof product.price === "string"
              ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
              : product.price || 0,
          availability:
            (product.initial_stock || 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          // 🟢 FIX 2: Corrected URL from abcclassic.com to your actual domain
          url: `https://www.phonixmobile.store/product/${encodeURIComponent(identifier)}`,

          // 🟢 FIX 3: Added Shipping Details (Resolves Merchant Listing Warning)
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0", // Change to actual shipping cost if not free
              currency: "INR",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 3,
                unitCode: "DAY",
              },
            },
          },

          // 🟢 FIX 4: Added Return Policy (Resolves Merchant Listing Warning)
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory:
              "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 7, // Change to your actual return days
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
          },
        },
        // 🟢 NOTE ON REVIEWS:
        // To remove the 'review' and 'aggregateRating' warnings,
        // you must eventually pull real customer review data from your database.
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
