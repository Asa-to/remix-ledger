import { Box } from "@mantine/core";
import { FC, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  imageSrc?: string;
  size?: number;
};

export const PopoutPurin: FC<Props> = ({
  children,
  imageSrc = "/images/pompompurin/jump.png",
  size = 70,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setAnimationKey((prev) => prev + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleAnimationEnd = () => {
    setIsHovered(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      w="fit-content"
    >
      {children}
      {isHovered && (
        <Box
          key={animationKey}
          className="pompom-character"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "50%",
            transform: "translateX(-50%)",
            width: size,
            height: size,
            pointerEvents: "none",
            zIndex: 100,
            animation: "pompom-popout 1s ease-out forwards",
          }}
          onAnimationEnd={handleAnimationEnd}
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
      )}
    </Box>
  );
};
