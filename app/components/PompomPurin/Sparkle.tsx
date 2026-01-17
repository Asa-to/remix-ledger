import { Box } from "@mantine/core";
import { FC, useEffect, useState } from "react";

type SparkleParticle = {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
};

type Props = {
  isActive: boolean;
  onComplete?: () => void;
};

export const Sparkle: FC<Props> = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: SparkleParticle[] = Array.from({ length: 8 }).map(
        (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 80 - 40,
          y: Math.random() * 40 - 20,
          delay: Math.random() * 0.3,
          size: 12 + Math.random() * 8,
        })
      );
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {particles.map((particle) => (
        <Box
          key={particle.id}
          className="pompom-sparkle"
          sx={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            fontSize: particle.size,
            animation: `sparkle-float 0.8s ease-out ${particle.delay}s forwards`,
            opacity: 0,
            animationFillMode: "forwards",
          }}
          style={{
            animationDelay: `${particle.delay}s`,
          }}
        >
          ✨
        </Box>
      ))}
    </Box>
  );
};
