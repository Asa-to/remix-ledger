import { Stack } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

export const CoverArea = (props: Props) => {
  const { children, title } = props;

  return (
    <Stack
      sx={{
        position: "relative",
        border: "2px double black",
        padding: "12px",
        ":before": {
          content: `"${title}"`,
          position: "absolute",
          top: "-2px",
          padding: "0px 4px",
          transform: "translateY(-50%)",
          backgroundColor: "rgb(248,249,250)",
        },
      }}
    >
      {children}
    </Stack>
  );
};
