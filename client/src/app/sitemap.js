const BASE_URL = "https://www.phonixmobile.store";
const API_BASE_URL = "https://www.phonixmobile.store/api";

export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // 1. Static Routes (Always Guaranteed)
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
  } catch (e) {
    // Fail silently so sitemap never crashes into an HTML error page
    console.error("Sitemap service fetch error:", e);
  }

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
  } catch (e) {
    console.error("Sitemap product fetch error:", e);
  }

  return [...staticRoutes, ...serviceRoutes, ...productRoutes];
}
