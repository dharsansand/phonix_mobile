import AboutSection from "../componses/AboutSection";
import Banner from "../componses/Banner";
import FaqSection from "../componses/FaqSection";
import ProductSection from "../componses/ProductSection";
import TestimonialsSection from "../componses/TestimonialsSection";
import WhyChooseUs from "../componses/WhyChooseUs";

// 🟢 1. Next.js App Router SEO Metadata
export const metadata = {
  title: "PhonixMobile Service Center & CustmKart | Mobile Service Tirupur",
  description:
    "PhonixMobile - Trusted since 2016 for smartphone chip-level service, original display replacements, and premium mobile accessories in Tirupur.",
  keywords: [
    "Phonix Mobile",
    "PhonixMobile Service Center & CustmKart",
    "Mobile Service Tirupur",
    "iPhone Service Tirupur",
    "Display Replacement Tirupur",
    "Mobile Repair Shop Near Me",
    "Periyar Colony Mobile Shop",
  ],
  alternates: {
    canonical: "https://www.phonixmobile.store", // Ensure this is your correct domain
  },
  openGraph: {
    title: "PhonixMobile Service Center & CustmKart",
    description:
      "Quality is our validity. Authorized multi-brand smartphone repair workshop in Tirupur.",
    url: "https://www.phonixmobile.store",
    siteName: "PhonixMobile",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
        width: 1200,
        height: 630,
        alt: "PhonixMobile Service Center & CustmKart",
      },
    ],
  },
};

export default function HomePage() {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    // 1. Use the exact name from Google Maps
    name: "PhonixMobile Service Center & CustmKart",
    url: "https://www.phonixmobile.store",
    logo: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    image:
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    description:
      "No.1 mobile phone repair center and accessories store in Tirupur. Specializing in display replacements, chip-level service, and genuine accessories.",
    telephone: "+917502634924",
    priceRange: "₹₹",

    // 2. LINK TO GOOGLE MAPS (This is what you asked for)
    sameAs: [
      "https://www.google.com/maps/place/PhonixMobile+Service+Center+%26+CustmKart/data=!4m2!3m1!1s0x0:0x79a903323868fdeb",
    ],

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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mobile Repair Services & Products",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Mobile Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Original Screen & Display Replacement",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Motherboard Chip-Level Repair",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Accessories",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Fast Chargers & Type-C Cables",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Premium Protective Cases & Tempered Glass",
              },
            },
          ],
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />

      <Banner />
      <AboutSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
