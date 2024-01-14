import { useCallback, useState } from "react";

export const useDisclosure: (
  props: boolean,
) => [boolean, { toggle: () => void }] = (initialValue) => {
  const [visible, setVisible] = useState(initialValue);
  const toggle = () => {
    setVisible((v) => !v);
  };

  return [visible, { toggle }];
};
