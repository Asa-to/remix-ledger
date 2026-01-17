import { useState, useEffect, type CSSProperties } from "react";

type CharacterConfig = {
  image: string;
  size: number;
  bounceAlt?: boolean;
};

const characters: CharacterConfig[] = [
  { image: "/images/pompompurin/normal.png", size: 50,  bounceAlt: true },
  { image: "/images/pompompurin/happy.png", size: 60 },
  { image: "/images/pompompurin/patapata.png", size: 45, bounceAlt: false },
  { image: "/images/pompompurin/purupuru.png", size: 50, bounceAlt: true },
  { image: "/images/pompompurin/dance.png", size: 55 },
  { image: "/images/pompompurin/mukimuki.png", size: 50, bounceAlt: true },
  { image: "/images/pompompurin/nawatobi.png", size: 45 },
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
          animationDelay: `${index * 2}s`,
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
