// app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { PREVIEW_IMAGE_URL, SITE_DESCRIPTION, SITE_HOST, SITE_NAME } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export default async function OpenGraphImage() {
  try {
    const res = await fetch(PREVIEW_IMAGE_URL, { cache: "force-cache" });
    if (!res.ok) throw new Error(`failed to fetch og image: ${res.status}`);

    const buf = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);
    const dataUrl = `data:image/png;base64,${base64}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#000",
            display: "flex",
          }}
        >
          <img
            src={dataUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ),
      size
    );
  } catch {
    // fallback (still valid if remote image fetch fails for any bot/platform)
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#ffffff",
            color: "#000000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              {SITE_NAME}
            </div>

            <div
              style={{
                marginTop: 28,
                fontSize: 32,
                lineHeight: 1.25,
                color: "rgba(0,0,0,0.72)",
                maxWidth: 960,
              }}
            >
              {SITE_DESCRIPTION}
            </div>
          </div>

          <div style={{ fontSize: 22, color: "rgba(0,0,0,0.45)" }}>
            {SITE_HOST}
          </div>
        </div>
      ),
      size
    );
  }
}
