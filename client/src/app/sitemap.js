// src/app/sitemap.js

const BASE_URL = "https://www.phonixmobile.store";
const API_BASE_URL = "https://www.phonixmobile.store/api";

export default async function sitemap() {
  const staticRoutes = [
    { url: `${BASE_URL}/` },
    { url: `${BASE_URL}/services` },
    { url: `${BASE_URL}/product` },
    { url: `${BASE_URL}/about` },
    { url: `${BASE_URL}/contact` },
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
        }));
    }
  } catch (e) {
    console.error("Sitemap service error:", e);
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
        }));
    }
  } catch (e) {
    console.error("Sitemap product error:", e);
  }

  return [...staticRoutes, ...serviceRoutes, ...productRoutes];
}
