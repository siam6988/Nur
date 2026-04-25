import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
}

export const useSEO = ({ title, description, keywords, image, url, type = 'website', schema }: SEOProps) => {
  useEffect(() => {
    const baseTitle = 'NUR - Best Online Shopping Website in Bangladesh | Buy Electronics, Fashion & More';
    const siteTitle = title ? `${title} - NUR` : baseTitle;
    
    document.title = siteTitle;

    const setMetaTag = (selector: string, attribute: string, value: string, nameAttr = 'name') => {
      let element = document.querySelector(`meta[${nameAttr}="${selector}"]`);
      if (element) {
        element.setAttribute('content', value);
      } else {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, selector);
        element.setAttribute('content', value);
        document.head.appendChild(element);
      }
    };

    // Standard Meta
    setMetaTag('description', 'content', description);
    if (keywords) setMetaTag('keywords', 'content', keywords);

    // Open Graph
    setMetaTag('og:title', 'content', siteTitle, 'property');
    setMetaTag('og:description', 'content', description, 'property');
    setMetaTag('og:type', 'content', type, 'property');
    
    const siteUrl = url || window.location.href;
    setMetaTag('og:url', 'content', siteUrl, 'property');
    
    const bannerImage = image || 'https://nur-eight.vercel.app/banner.jpg'; // Placeholder default image
    setMetaTag('og:image', 'content', bannerImage, 'property');

    // Twitter Card
    setMetaTag('twitter:card', 'content', 'summary_large_image');
    setMetaTag('twitter:title', 'content', siteTitle);
    setMetaTag('twitter:description', 'content', description);
    setMetaTag('twitter:image', 'content', bannerImage);

    // Schema Markup
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, image, url, type, schema]);
};
