import { useState } from "react";
import { IBookStory, getGenreColor } from "./BookShelf";

interface Props {
  story: IBookStory;
  onClick: () => void;
}

export default function Book3D({ story, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const colors = getGenreColor(story.tag);
  const wordCount = story.content.split(/\s+/).length;

  const height = Math.min(180, Math.max(120, 120 + wordCount / 20));
  const width = Math.min(60, Math.max(35, 35 + story.title.length / 3));
  const thickness = Math.min(
  20,
  Math.max(6, wordCount / 200)
);
const randomTilt =
  ((story.title.length % 7) - 3) * 2;

const genreIcons: Record<string, string> = {
  Fantasy: "🐉",
  Horror: "👻",
  Romance: "❤️",
  SciFi: "🚀",
  Mystery: "🕵️",
  Adventure: "🗺️",
};

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1",
        perspective: "600px",
        cursor: "pointer",
        display: "flex",
        overflow: "visible",
        alignItems: "flex-end",
        justifyContent: "center",
        height: `${height + 20}px`,
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: hovered
        ? `rotateY(-45deg) rotateZ(${randomTilt}deg) translateY(-12px)`
        : `rotateY(-5deg) rotateZ(${randomTilt}deg)`,
          transition: "all 0.3s ease",
          filter: hovered
 ? `drop-shadow(0 0 18px ${colors.glow})`
 : "none",
boxShadow: hovered
 ? `0 0 20px ${colors.glow}50`
 : "none",
        }}
      >

        {/* Book spine (front face) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${colors.spine} 0%, ${colors.glow}40 100%)`,
            borderRadius: "2px 6px 6px 2px",
            border: `1px solid ${colors.glow}40`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 4px",
            overflow: "hidden",
          }}
        >
          {wordCount > 2000 && (
  <div
    style={{
      position: "absolute",
      top: "4px",
      left: "4px",
      fontSize: "12px",
    }}
  >
    👑
  </div>
)}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "10px",
            height: "25px",
            background: "#ef4444",
            clipPath:
              "polygon(0 0,100% 0,100% 100%,50% 80%,0 100%)",
          }}
        />
          {/* Decorative lines */}
          <div style={{
            position: "absolute",
            top: "8px",
            left: "4px",
            right: "4px",
            height: "1px",
            background: `${colors.glow}40`,
          }} />
          <div style={{
            position: "absolute",
            bottom: "8px",
            left: "4px",
            right: "4px",
            height: "1px",
            background: `${colors.glow}40`,
          }} />

          {/* Title (vertical) */}
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontSize: "10px",
              fontWeight: "700",
              color: colors.text,
              textAlign: "center",
              lineHeight: "1.2",
              maxHeight: `${height - 30}px`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "0.05em",
            }}
          >
            {story.title}
          </div>
              <div
          style={{
            position: "absolute",
            top: "18px",
            fontSize: "14px",
          }}
        >
          {genreIcons[story.tag] || "📖"}
        </div>
        <div
  style={{
    position: "absolute",
    bottom: "0",
    left: "0",
    width: `${Math.min(
      100,
      (wordCount / 2000) * 100
    )}%`,
    height: "3px",
    background: colors.glow,
  }}
/>
          {/* Genre dot */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: colors.glow,
            boxShadow: `0 0 6px ${colors.glow}`,
          }} />
        </div>

        {/* Book side (right face for 3D effect) */}
        <div
          style={{
            position: "absolute",
            top: "2px",
            bottom: "2px",
            right: `-${thickness}px`,
            width: `${thickness}px`,
            background: `linear-gradient(90deg, ${colors.spine} 0%, #0a0a0f 100%)`,
            transform: "rotateY(90deg)",
            transformOrigin: "left center",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Book top */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "2px",
            right: "-6px",
            height: "4px",
            background: `linear-gradient(90deg, #e8e0d0 0%, #c8b8a0 100%)`,
            transform: "rotateX(90deg)",
            transformOrigin: "bottom center",
            borderRadius: "2px 2px 0 0",
          }}
        />
        {hovered && (
  <div
    style={{
      position: "absolute",
      left: `${width + 20}px`,
      top: "10px",
      width: "220px",
      background: "#111827",
      padding: "12px",
      borderRadius: "12px",
      border: `1px solid ${colors.glow}`,
      zIndex: 100,
      boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    }}
  >
    <div
      style={{
        fontWeight: "bold",
        marginBottom: "6px",
        color: colors.glow,
      }}
    >
      {story.title}
    </div>

    <div
      style={{
        fontSize: "12px",
        color: "#d1d5db",
        lineHeight: "1.5",
      }}
    >
      {story.content.slice(0, 120)}...
    </div>
  </div>
)}
        {hovered && (
  <div
    style={{
      position: "absolute",
      bottom: "-45px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#111827",
      padding: "6px 10px",
      borderRadius: "8px",
      fontSize: "10px",
      whiteSpace: "nowrap",
      zIndex: 50,
    }}
  >
    {wordCount} words
  </div>
)}
      </div>
    </div>
  );
}