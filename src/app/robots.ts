import type { MetadataRoute } from "next";

/* The staff area and the auth API are never crawled (Requirements_Admin.md section 3). */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: ["/admin", "/api/"] }] };
}
