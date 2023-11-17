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
          backgroundColor: "#26D61B",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          style={{ marginBottom: "48px" }}
          width="256"
          height="256"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#ffffff" d="M161.846 320h192l4.923-32h-192l-4.923 32z" />
          <path
            fill="#ffffff"
            d="M467.122 16L450.7 128h-29.525L439.49 16h-32.425l-35.321 216H155.819a48.051 48.051 0 0 0-47.152 39.019l-9.354 49.106A88 88 0 1 0 188.673 432H314.05a144 144 0 0 0 142.589-123.889L499.464 16ZM104 464a56 56 0 1 1 56-56a56.063 56.063 0 0 1-56 56Zm320.963-160.433A111.266 111.266 0 0 1 400 359.585A113.582 113.582 0 0 1 371.477 384a111.226 111.226 0 0 1-57.427 16H191.633a87.325 87.325 0 0 0-5.657-24h159.255l4.923-32H164.333q-2.626-2.476-5.451-4.735a87.882 87.882 0 0 0-27.783-14.99L139.532 280l.571-2.994A16.015 16.015 0 0 1 155.819 264h243.117l17.006-104h30.068Z"
          />
        </svg>
        <div
          style={{
            color: "white",
            fontSize: 56,
            marginBottom: "4px",
            fontWeight: "900",
          }}
        >
          파크골프 가자
        </div>
        <div style={{ color: "white", fontSize: 20 }}>
          전국의 파크골프장을 한 곳에서!
        </div>
      </div>
    ),
    {
      width: 1200,
      emoji: "twemoji",
    },
  );
}
