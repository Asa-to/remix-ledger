import { Box } from "@mantine/core";
import { FC, ReactNode, useCallback, useState } from "react";

type BurstItem = {
  id: number;
  x: number;
  y: number;
};

type Props = {
  children: ReactNode;
  imageSrc?: string;
  size?: number;
};

const DIRECTIONS = [
  "pompom-burst-top-left",
  "pompom-burst-top-right",
  "pompom-burst-bottom-left",
  "pompom-burst-bottom-right",
] as const;

export const ClickBurstPurin: FC<Props> = ({
  children,
  imageSrc = "/images/pompompurin/happy.png",
  size = 200,
}) => {
  const [bursts, setBursts] = useState<BurstItem[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // ボタンやリンクのクリックは除外
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBurst: BurstItem = {
      id: Date.now(),
      x,
      y,
    };

    setBursts((prev) => [...prev, newBurst]);

    // アニメーション終了後に削除
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 800);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
      }}
      onClick={handleClick}
    >
      {children}
      {bursts.map((burst) => (
        <Box
          key={burst.id}
          sx={{
            position: "absolute",
            left: burst.x,
            top: burst.y,
            pointerEvents: "none",
            zIndex: 1000,
            width: size,
            height: size,
            transform: "translate(-50%, -25%)",
          }}
        >
          {DIRECTIONS.map((direction, index) => (
            <Box
              key={`${burst.id}-${index}`}
              className="pompom-character"
              sx={{
                position: "absolute",
                animation: `${direction} 0.7s ease-out forwards`,
              }}
            >
              <Box
                component="img"
                src={imageSrc}
                alt=""
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "/images/pompompurin/normal.png";
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
