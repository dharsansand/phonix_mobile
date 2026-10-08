export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/cart",
          "/checkout",
          "/login",
          "/orders",
          "/wishlist",
        ],
      },
    ],
    sitemap: "https://www.phonixmobile.store/sitemap.xml",
  };
}
