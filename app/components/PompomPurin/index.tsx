import { Box } from "@mantine/core";
import { FC, useCallback, useEffect, useState } from "react";
import { Sparkle } from "./Sparkle";

export type PurinState = "normal" | "happy" | "jumping";

type Props = {
  size?: number;
  state?: PurinState;
  showSparkle?: boolean;
  onSparkleComplete?: () => void;
};

const IMAGE_MAP: Record<PurinState, string> = {
  normal: "/images/pompompurin/normal.png",
  happy: "/images/pompompurin/happy.png",
  jumping: "/images/pompompurin/jump.png",
};

export const PompomPurin: FC<Props> = ({
  size = 120,
  state = "normal",
  showSparkle = false,
  onSparkleComplete,
}) => {
  const [currentImage, setCurrentImage] = useState(IMAGE_MAP.normal);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (state === "jumping") {
      setIsJumping(true);
      setCurrentImage(IMAGE_MAP.jumping);

      const timer = setTimeout(() => {
        setIsJumping(false);
      }, 500);

      return () => clearTimeout(timer);
    } else if (state === "happy") {
      setCurrentImage(IMAGE_MAP.happy);
    } else {
      setCurrentImage(IMAGE_MAP.normal);
    }
  }, [state]);

  const handleImageError = useCallback(() => {
    setCurrentImage(IMAGE_MAP.normal);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <Box
        className="pompom-character"
        sx={{
          width: size,
          height: size,
          willChange: "transform",
          animation: isJumping
            ? "pompom-jump 0.5s ease-out"
            : "pompom-float 3s ease-in-out infinite",
        }}
      >
        <Box
          component="img"
          src={currentImage}
          alt="ポムポムプリン"
          onError={handleImageError}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </Box>
      <Sparkle isActive={showSparkle} onComplete={onSparkleComplete} />
    </Box>
  );
};
