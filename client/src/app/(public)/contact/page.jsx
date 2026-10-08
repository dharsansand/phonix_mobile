import ContactClient from "./ContactClient";

// 🟢 1. Next.js App Router SEO Metadata
export const metadata = {
  title: "Contact Phonix Mobile | Workshop & Support in Tirupur",
  description:
    "Contact Phonix Mobile for instant smartphone repair estimates, display replacements, battery service, and genuine accessories in Periyar Colony, Tirupur. Call +91 7502634924 or chat on WhatsApp.",
  keywords: [
    "Contact Phonix Mobile",
    "Mobile Service Center Tirupur Address",
    "Phonix Mobile Phone Number",
    "Periyar Colony Mobile Shop",
    "iPhone Repair Contact Tirupur",
    "WhatsApp Mobile Repair Estimate",
  ],
  alternates: {
    canonical: "https://www.phonixmobile.store/contact",
  },
  openGraph: {
    title: "Contact Phonix Mobile | Get Instant Repair Estimates",
    description:
      "Visit our service center in Periyar Colony, Tirupur or get an instant diagnostic quote via WhatsApp: +91 7502634924.",
    url: "https://www.phonixmobile.store/contact",
    siteName: "Phonix Mobile",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dujuxbpv3/image/upload/v1790317185/ChatGPT_Image_Sep_25_2026_11_49_04_AM_fkbitc.png",
        width: 1200,
        height: 630,
        alt: "Contact Phonix Mobile Tirupur",
      },
    ],
  },
};

export default function ContactPage() {
  // 🟢 2. Schema.org JSON-LD Structured Data
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Phonix Mobile",
    url: "https://www.phonixmobile.store/contact",
    description:
      "Get instant repair estimates or visit our service center in Tirupur.",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Phonix Mobile - Service & Accessories",
      url: "https://www.phonixmobile.store",
      telephone: "+917502634924",
      email: "support@phonixmobile.com",
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
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}
