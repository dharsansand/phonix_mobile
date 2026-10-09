import { Suspense } from "react";
import ServiceDetailClient from "./ServiceDetailClient";

const API_BASE_URL = "https://phonix-mobile.onrender.com/api";

// 🟢 Helper function to fetch data (Used by both Metadata and Page)
// Next.js automatically deduplicates these requests, so it's efficient.
async function getServiceData(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/service/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || data || null;
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const service = await getServiceData(slug);

  if (!service) {
    return {
      title: "Service Details | Phonix Mobile Tirupur",
      description: "Smartphone repair and restoration services in Tirupur.",
    };
  }

  const cleanDesc = service.desc?.replace(/<[^>]*>?/gm, "").slice(0, 160) || "";

  return {
    title:
      service.meta_title ||
      `${service.title} (${service.device || "Mobile"}) | Phonix Mobile`,
    description:
      service.meta_description ||
      `Get certified ${service.title} for ${service.device} at Phonix Mobile, Tirupur. Turnaround: ${service.turnaround || "Fast"}, Warranty: ${service.warranty || "Available"}.`,
    keywords:
      service.meta_keywords ||
      `${service.title}, ${service.device} repair, Tirupur mobile service`,
    alternates: {
      canonical: `https://www.phonixmobile.store/services/${slug}`,
    },
    openGraph: {
      title: service.meta_title || service.title,
      description: cleanDesc,
      url: `https://www.phonixmobile.store/services/${slug}`,
      images: [
        {
          url:
            service.afterImg ||
            "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const service = await getServiceData(slug);

  // 🟢 1. Build Service Schema (Structured Data)
  const serviceSchema = service
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.desc?.replace(/<[^>]*>?/gm, "") || service.title,
        serviceType: "Mobile Phone Repair",
        provider: {
          "@type": "LocalBusiness",
          name: "PhonixMobile Service Center & CustmKart", // Match your Maps name
          url: "https://www.phonixmobile.store",
          telephone: "+917502634924",
          image:
            "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Periyar Colony",
            addressLocality: "Tirupur",
            addressRegion: "Tamil Nadu",
            postalCode: "641652",
            addressCountry: "IN",
          },
        },
        areaServed: {
          "@type": "City",
          name: "Tirupur",
        },
        // Adding details if they exist in your API
        offers: {
          "@type": "Offer",
          description: `Warranty: ${service.warranty || "Standard"}`,
          availability: "https://schema.org/InStock",
        },
        image:
          service.afterImg ||
          "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
      }
    : null;

  return (
    <>
      {/* 🟢 2. Inject Schema into the Head */}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}

      <Suspense
        fallback={
          <div
            style={{
              padding: "8rem 2rem",
              textAlign: "center",
              color: "#00d2ff",
            }}
          >
            Loading Service Case...
          </div>
        }
      >
        <ServiceDetailClient slug={slug} />
      </Suspense>
    </>
  );
}
