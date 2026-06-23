"use client";

import { useEffect, useState } from "react";

export type SiteImages = Record<string, string>;

export function useSiteImages() {
  const [images, setImages] = useState<SiteImages>({});

  useEffect(() => {
    let active = true;

    fetch("/api/site-images")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (active && data && typeof data === "object") {
          setImages(data as SiteImages);
        }
      })
      .catch(() => {
        if (active) setImages({});
      });

    return () => {
      active = false;
    };
  }, []);

  return images;
}

