import { Box, Text } from "@mantine/core";
import type { FC } from "react";

type Props = {
  label: string;
  value: string;
  labelWidth?: string;
};

export const LabelValueItem: FC<Props> = (props) => {
  const { label, value, labelWidth = "120px" } = props;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: `${labelWidth} 1fr` }}>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </Box>
  );
};
