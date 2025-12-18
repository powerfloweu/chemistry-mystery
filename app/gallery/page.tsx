"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Guard, BasicShell } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import Slideshow, { Slide } from "@/components/ui/Slideshow";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";
import { isDevMode } from "@/lib/gameStore";

const slides: Slide[] = [
  { src: "/DSC01241.JPG", alt: "Memory 1" },
  { src: "/DSC01426.JPG", alt: "Memory 2" },
  { src: "/IMG_0604.JPG", alt: "Memory 3" },
  { src: "/IMG_0671.JPG", alt: "Memory 4" },
  { src: "/IMG_0714.JPG", alt: "Memory 5" },
  { src: "/IMG_7223.jpg", alt: "Memory 6" },
  { src: "/IMG_7457.JPG", alt: "Memory 7" },
  { src: "/IMG_7487.JPG", alt: "Memory 8" },
  { src: "/IMG_7609.JPG", alt: "Memory 9" },
  { src: "/IMG_7610.JPG", alt: "Memory 10" },
  { src: "/IMG_7611.JPG", alt: "Memory 11" },
  { src: "/IMG_7964.JPG", alt: "Memory 12" },
  { src: "/IMG_8180.JPG", alt: "Memory 13" },
  { src: "/IMG_8208.JPG", alt: "Memory 14" },
  { src: "/IMG_8437.jpg", alt: "Memory 15" },
  { src: "/IMG_8605.JPG", alt: "Memory 16" },
  { src: "/IMG_8663.JPG", alt: "Memory 17" },
  { src: "/IMG_8695.JPG", alt: "Memory 18" },
  { src: "/IMG_8718.JPG", alt: "Memory 19" },
  { src: "/IMG_8721.JPG", alt: "Memory 20" },
  { src: "/IMG_8749.JPG", alt: "Memory 21" },
  { src: "/IMG_9030.JPG", alt: "Memory 22" },
  { src: "/IMG_9227.JPG", alt: "Memory 23" },
  { src: "/IMG_9368.JPG", alt: "Memory 24" },
  { src: "/IMG_9746.JPG", alt: "Memory 25" },
  { src: "/IMG_9780.JPG", alt: "Memory 26" },
  { src: "/IMG_9831.JPG", alt: "Memory 27" },
];

export default function Gallery() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [portraitSlides, setPortraitSlides] = useState<Slide[]>(slides);


  // Filter out horizontal images so only portrait shots remain
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const results = await Promise.all(
        slides.map(
          (s) =>
            new Promise<Slide | null>((resolve) => {
              const img = new Image();
              img.onload = () => {
                if (img.naturalHeight > img.naturalWidth) resolve(s);
                else resolve(null);
              };
              img.onerror = () => resolve(null);
              img.src = s.src;
            })
        )
      );
      if (!cancelled) {
        const filtered = results.filter((x): x is Slide => Boolean(x));
        setPortraitSlides(filtered);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSlides = portraitSlides.length ? portraitSlides : slides;

  return (
    <Guard require={["final_ok"]}>
      <BasicShell title="Evidence of bonding">
        <div className="space-y-6">
          <div className="space-y-4">
            {!started && (
              <div className="space-y-3">
                <Button variant="primary" onClick={() => setStarted(true)} className="w-full">
                  Unseal memory
                </Button>
              </div>
            )}

            {started && (
              <div className="space-y-3">
                <Slideshow slides={activeSlides} intervalMs={3200} loop={false} onComplete={() => router.push("/reveal")} />
                <audio controls loop className="w-full mt-4">
                  <source src="/audio/Just say yes.mp3" type="audio/mpeg" />
                </audio>
                <p className="text-xs text-slate-700/70">
                  Press play if you want music. When the slideshow finishes, a hidden task shall unlock!
                </p>
              </div>
            )}
          </div>
        </div>
      </BasicShell>
    </Guard>
  );
}