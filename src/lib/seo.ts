import { absoluteUrl, site } from "@/data/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Shorter variants for social cards; fall back to the page title/description. */
  ogTitle?: string;
  ogDescription?: string;
};

// Shared <head> for every route: absolute canonical, Open Graph and Twitter tags.
export function pageHead({ title, description, path, ogTitle, ogDescription }: PageSeo) {
  const url = absoluteUrl(path);
  const image = `${site.url}${site.ogImage}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: site.locale },
      { property: "og:title", content: ogTitle ?? title },
      { property: "og:description", content: ogDescription ?? description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
