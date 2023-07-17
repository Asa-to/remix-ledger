import { Flex, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

export const HeaderContent: FC<Props> = (props) => {
  const { children, title } = props;
  return (
    <Flex justify="space-between" direction="row">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Title>{title}</Title>
      </Link>
      {children}
    </Flex>
  );
};
