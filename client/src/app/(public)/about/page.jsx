import AboutClient from "./AboutClient";

// 🟢 1. Next.js 14/15 App Router SEO Metadata
export const metadata = {
  title:
    "About Phonix Mobile | No.1 Smartphone Service & Accessories in Tirupur",
  description:
    "Learn about Phonix Mobile's journey since 2016 in Periyar Colony, Tirupur. Certified master technicians specializing in laser screen separation, chip-level micro-soldering, and OEM spare parts with a 90-day warranty.",
  keywords: [
    "About Phonix Mobile",
    "Mobile Service Center Tirupur",
    "iPhone Repair Specialist Tirupur",
    "Motherboard Repair Lab Tirupur",
    "Periyar Colony Mobile Repair",
    "Genuine Mobile Spare Parts Tirupur",
    "Phonix Mobile Story",
    "Best Mobile Shop in Tirupur",
  ],
  alternates: {
    canonical: "https://phonixmobile.com/about",
  },
  openGraph: {
    title: "About Phonix Mobile | Quality Is Our Validity Since 2016",
    description:
      "Tirupur's premier multi-brand smartphone diagnostic lab and genuine accessories store. Over 50,000 devices successfully restored.",
    url: "https://phonixmobile.com/about",
    siteName: "Phonix Mobile",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
        width: 1200,
        height: 630,
        alt: "Phonix Mobile Diagnostic Workshop Tirupur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Phonix Mobile | No.1 Service in Tirupur",
    description:
      "Precision smartphone engineering, laser screen separation, and genuine spares with a 90-day warranty in Tirupur.",
    images: [
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    ],
  },
};

export default function AboutPage() {
  // 🟢 2. Schema.org JSON-LD Structured Data for AboutPage & LocalBusiness
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Phonix Mobile",
    url: "https://phonixmobile.com/about",
    description:
      "Phonix Mobile has been providing certified chip-level mobile restorations and original accessories in Tirupur since 2016.",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Phonix Mobile - Service & Accessories",
      url: "https://phonixmobile.com",
      logo: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
      image:
        "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
      telephone: "+917502634924",
      priceRange: "₹₹",
      foundingDate: "2016",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Periyar Colony",
        addressLocality: "Tirupur",
        addressRegion: "Tamil Nadu",
        postalCode: "641652",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 11.1085,
        longitude: 77.3411,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:30",
          closes: "21:30",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1250",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutClient />
    </>
  );
}
