import ServicesClient from "./ServicesClient";

// 🟢 1. Next.js 14/15 SEO Metadata
export const metadata = {
  title:
    "Smartphone Repair Services & Before/After Cases | Phonix Mobile Tirupur",
  description:
    "Explore real Before & After smartphone repair case studies from Phonix Mobile. Original display replacements, chip-level motherboard restorations, and battery replacements with a 90-day warranty in Periyar Colony, Tirupur.",
  keywords: [
    "Mobile Repair Services Tirupur",
    "Screen Replacement Before and After",
    "iPhone Display Repair Tirupur",
    "Samsung Motherboard IC Fix",
    "Broken Glass Separation Tirupur",
    "Mobile Repair Warranty Tirupur",
    "Phonix Mobile Repair Cases",
  ],
  alternates: {
    canonical: "https://phonixmobile.com/services",
  },
  openGraph: {
    title: "Smartphone Repair Cases & Services | Phonix Mobile Tirupur",
    description:
      "Interactive Before & After screen restorations, 4K microscope IC fixes, and genuine spares with 90-day warranty.",
    url: "https://phonixmobile.com/services",
    siteName: "Phonix Mobile",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
        width: 1200,
        height: 630,
        alt: "Phonix Mobile Repair Services Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phonix Mobile Repair Services | Tirupur",
    description:
      "Interactive Before & After smartphone repair case studies. Original display and chip-level restoration.",
    images: [
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    ],
  },
};

export default function ServicesPage() {
  // 🟢 2. Schema.org JSON-LD Structured Data for Services & LocalBusiness
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Mobile Phone Repair",
    provider: {
      "@type": "LocalBusiness",
      name: "Phonix Mobile - Service & Accessories",
      telephone: "+917502634924",
      url: "https://phonixmobile.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Periyar Colony",
        addressLocality: "Tirupur",
        addressRegion: "Tamil Nadu",
        postalCode: "641652",
        addressCountry: "IN",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Smartphone Restorations Catalog",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Laser Screen & Glass Replacement",
            description:
              "Precision laser separation preserving 100% factory OLED panel & True Tone.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Motherboard Chip-Level & IC Repair",
            description:
              "Micro-soldering and BGA reballing for dead and water-damaged boards.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Certified Battery Replacement",
            description:
              "Fresh cycle OEM lithium polymer cells with 90-day replacement warranty.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Water & Liquid Damage Restoration",
            description:
              "Ultrasonic chemical de-oxidation prioritizing zero data loss.",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <ServicesClient />
    </>
  );
}
