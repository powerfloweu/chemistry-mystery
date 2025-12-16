"use client";

import Link from "next/link";
import { Guard, BasicShell } from "../../components/Guard";
import Slideshow from "@/components/ui/Slideshow";

export default function Archive() {
  return (
    <Guard require={["token1", "token2", "token3"]}>
      <BasicShell title="LAB ARCHIVE PROTOCOL" subtitle="Scan the Archive Tag to open the repository.">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Locate the Archive Tag and scan it. Do not proceed without the tag.</p>

          <div className="rounded-xl border p-3 text-sm text-muted-foreground">
            Hidden Archive QR should link directly to /final-lock.
          </div>

          <div className="mt-4">
            <p className="text-xs text-slate-700/60">For testing, a direct link to the Final Lock:</p>
            <Link href="/final-lock" className="inline-block mt-2 rounded-xl border px-4 py-3 bg-amber-50 hover:bg-amber-100">
              Open Final Lock
            </Link>
          </div>

          {/* Slideshow of moments (images to be uploaded later into public/images) */}
          <div className="mt-6">
            <Slideshow
              slides={[
                { src: "/images/placeholder-1.jpg", alt: "Moment 1", caption: "Our first field note." },
                { src: "/images/placeholder-2.jpg", alt: "Moment 2", caption: "Archive day." },
                { src: "/images/placeholder-3.jpg", alt: "Moment 3", caption: "Catalyst of change." },
              ]}
              intervalMs={4000}
            />
            <p className="mt-2 text-xs text-slate-700/60">Replace the placeholders by uploading your photos to <span className="font-mono">public/images/</span> with matching filenames.</p>
          </div>
        </div>
      </BasicShell>
    </Guard>
  );
}
