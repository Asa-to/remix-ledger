import type { CSSProperties } from "react";

type CharacterConfig = {
  image: string;
  size: number;
  delay: number;
  bounceAlt?: boolean;
};

const characters: CharacterConfig[] = [
  { image: "/images/pompompurin/happy.png", size: 60, delay: 0 },
  { image: "/images/pompompurin/normal.png", size: 50, delay: 1.5, bounceAlt: true },
  { image: "/images/pompompurin/patapata.png", size: 45, delay: 3, bounceAlt: false },
  { image: "/images/pompompurin/purupuru.png", size: 50, delay: 4.5, bounceAlt: true },
  { image: "/images/pompompurin/dance.png", size: 55, delay: 6 },
  { image: "/images/pompompurin/mukimuki.png", size: 50, delay: 7.5, bounceAlt: true },
  { image: "/images/pompompurin/nawatobi.png", size: 45, delay: 9 },
];

export const MarchingPurin = () => {
  return (
    <div
      className="pompom-march-container"
      style={{
        position: "relative",
        width: "100%",
        height: "80px",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {characters.map((char, index) => {
        const marchStyle: CSSProperties = {
          position: "absolute",
          bottom: "10px",
          animation: `pompom-march 18s linear infinite`,
          animationDelay: `${char.delay}s`,
          animationFillMode: "backwards",
        };

        const bounceStyle: CSSProperties = {
          animation: char.bounceAlt
            ? `pompom-walk-bounce-alt 0.4s ease-in-out infinite`
            : `pompom-walk-bounce 0.4s ease-in-out infinite`,
        };

        return (
          <div key={index} style={marchStyle}>
            <div style={bounceStyle}>
              <img
                src={char.image}
                alt="ポムポムプリン"
                style={{
                  width: `${char.size}px`,
                  height: "auto",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
