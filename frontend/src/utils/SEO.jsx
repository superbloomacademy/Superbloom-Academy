/**
 * SEO Utility Component
 * Manages meta tags and structured data for React pages
 * Usage: <SEO title="..." description="..." image="..." />
 */

import { useEffect } from "react";

export const SEO = ({
  title = "Superbloom Academy - Industry-Oriented Training for Career Readiness",
  description = "Expert-led industry training programs for Engineering and Pharmacy students",
  image = "https://www.superbloomacademy.in/sba-logo.png",
  url = "https://www.superbloomacademy.in",
  type = "website",
  structuredData = null,
}) => {
  // Update Meta Tags
  useEffect(() => {
    // Title
    document.title = title;

    // Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Open Graph Tags
    const ogTags = {
      "og:title": title,
      "og:description": description,
      "og:image": image,
      "og:url": url,
      "og:type": type,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Twitter Tags
    const twitterTags = {
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image,
    };

    Object.entries(twitterTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Add Structured Data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"][data-seo="true"]');
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      // Cleanup is optional - meta tags can persist
    };
  }, [title, description, image, url, type, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
