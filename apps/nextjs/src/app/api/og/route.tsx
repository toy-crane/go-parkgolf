import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 192 }}>⛳</div>
        <div style={{ marginTop: 36 }}>전국 파크골프장 정보를 한 곳에서!</div>
      </div>
    ),
    {
      width: 1200,
      // Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
      // Default to 'twemoji'
      emoji: "twemoji",
    },
  );
}
