import { Suspense } from "react";
import ServiceDetailClient from "./ServiceDetailClient";

const API_BASE_URL = "http://localhost:5000/api";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  try {
    const res = await fetch(`${API_BASE_URL}/service/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Service Details | Phonix Mobile Tirupur",
        description: "Smartphone repair and restoration services in Tirupur.",
      };
    }

    const data = await res.json();
    const service = data?.data || data || {};

    return {
      title:
        service.meta_title ||
        `${service.title} (${service.device}) | Phonix Mobile`,
      description:
        service.meta_description ||
        `Get certified ${service.title} for ${service.device} at Phonix Mobile, Tirupur. Turnaround: ${service.turnaround}, Warranty: ${service.warranty}.`,
      keywords:
        service.meta_keywords ||
        `${service.title}, ${service.device} repair, Tirupur mobile service`,
      alternates: {
        canonical: `https://phonixmobile.com/services/${slug}`,
      },
      openGraph: {
        title: service.meta_title || service.title,
        description:
          service.meta_description ||
          service.desc?.replace(/<[^>]*>?/gm, "").slice(0, 160),
        url: `https://phonixmobile.com/services/${slug}`,
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
  } catch (error) {
    return {
      title: "Repair Service | Phonix Mobile",
      description: "Expert smartphone repair services in Tirupur.",
    };
  }
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  return (
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
  );
}
