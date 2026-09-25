import AboutSection from "../componses/AboutSection";
import Banner from "../componses/Banner";
import FaqSection from "../componses/FaqSection";
import ProductSection from "../componses/ProductSection";
import TestimonialsSection from "../componses/TestimonialsSection";
import WhyChooseUs from "../componses/WhyChooseUs";

// 🟢 1. Next.js App Router SEO Metadata
export const metadata = {
  title: "Phonix Mobile | No.1 Mobile Service & Accessories in Tirupur",
  description:
    "Phonix Mobile - Trusted since 2016 for smartphone chip-level service, original display replacements, battery changes, water damage repair, and premium mobile accessories in Periyar Colony, Tirupur.",
  keywords: [
    "Phonix Mobile",
    "Mobile Service Tirupur",
    "iPhone Service Tirupur",
    "Display Replacement Tirupur",
    "Mobile Repair Shop Near Me",
    "Periyar Colony Mobile Shop",
    "Mobile Battery Replacement",
    "Chip Level Motherboard Repair",
    "Mobile Screen Glass Change",
    "Smartphone Accessories Tirupur",
  ],
  alternates: {
    canonical: "https://phonixmobile.com",
  },
  openGraph: {
    title: "Phonix Mobile | No.1 Mobile Service & Accessories",
    description:
      "Quality is our validity. Authorized multi-brand smartphone repair workshop and premium mobile accessories in Tirupur since 2016.",
    url: "https://phonixmobile.com",
    siteName: "Phonix Mobile",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
        width: 1200,
        height: 630,
        alt: "Phonix Mobile Service & Accessories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phonix Mobile | Quality is our Validity",
    description:
      "Expert smartphone repair, screen replacements, and premium accessories in Tirupur.",
    images: [
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    ],
  },
};

export default function HomePage() {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Phonix Mobile - Service & Accessories",
    url: "https://phonixmobile.com",
    logo: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    image:
      "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
    description:
      "No.1 mobile phone repair center and accessories store in Tirupur. Specializing in display replacements, chip-level service, and genuine accessories.",
    telephone: "+917502634924",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
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
                category: "Mobile Repair",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Motherboard Chip-Level Repair",
                category: "Mobile Repair",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Battery Replacement with Warranty",
                category: "Mobile Repair",
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
                "@type": "Product",
                name: "Fast Chargers & Type-C Cables",
                category: "Accessories",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Premium Protective Cases & Tempered Glass",
                category: "Accessories",
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
