import { Box, Button } from "@mantine/core";
import { FC, useState } from "react";
import { Sparkle } from "./Sparkle";

type Props = {
  label?: string;
  imageSrc?: string;
  size?: number;
};

export const HappyButton: FC<Props> = ({
  label = "Happy!",
  imageSrc = "/images/pompompurin/happy.png",
  size = 200,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleClick = () => {
    setIsActive(true);
    setAnimationKey((prev) => prev + 1);
  };

  const handleComplete = () => {
    setIsActive(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <Button
        variant="filled"
        color="yellow"
        onClick={handleClick}
        sx={{
          fontWeight: "bold",
        }}
      >
        {label}
      </Button>
      {isActive && (
        <Box
          key={animationKey}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "0",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <Box
            className="pompom-character"
            sx={{
              width: size,
              height: size,
              animation: "pompom-popout 1s ease-out forwards",
            }}
            onAnimationEnd={handleComplete}
          >
            <Box
              component="img"
              src={imageSrc}
              alt="Happy Purin"
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
          <Sparkle isActive={isActive} />
        </Box>
      )}
    </Box>
  );
};
