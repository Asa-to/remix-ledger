import { Box, Flex, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

export const HeaderContent: FC<Props> = (props) => {
  const { children, title } = props;
  return (
    <Box
      display="grid"
      px="8px"
      sx={{ height: "100%", gridTemplateColumns: "1fr 1fr" }}
    >
      <Box my="auto">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Title order={3}>{title}</Title>
        </Link>
      </Box>
      <Flex direction="row" align="center" justify="right" gap="16px">
        {children}
      </Flex>
    </Box>
  );
};
