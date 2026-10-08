const BASE_URL = "https://www.phonixmobile.store";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // 🟢 1. Core Static Pages
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/product`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 🟢 2. Dynamic Services (e.g. /services/screen-glass-replacement)
  let serviceRoutes = [];
  try {
    const res = await fetch(`${API_BASE_URL}/service`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const services = Array.isArray(data) ? data : data?.data || [];

      serviceRoutes = services
        .filter((item) => item.isActive !== false && item.isDelete !== true)
        .map((srv) => ({
          url: `${BASE_URL}/services/${srv.slug || srv._id}`,
          lastModified: srv.updatedAt || currentDate,
          changeFrequency: "weekly",
          priority: 0.85,
        }));
    }
  } catch (error) {
    console.error("Failed to fetch services for sitemap:", error);
  }

  // 🟢 3. Dynamic Products (e.g. /product/Silver-Keychain-Personalized)
  let productRoutes = [];
  try {
    const res = await fetch(`${API_BASE_URL}/product?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
          ? data
          : [];

      productRoutes = products
        .filter((prod) => prod.isActive !== false && prod.isdelete !== true)
        .map((prod) => ({
          url: `${BASE_URL}/product/${prod.slug || prod._id}`,
          lastModified: prod.updatedAt || currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  return [...staticRoutes, ...serviceRoutes, ...productRoutes];
}
