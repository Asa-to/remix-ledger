import { Badge, Box, Group, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

type Props = {
  name: string;
  require?: boolean;
};

export const MultiInput = (props: Props) => {
  const { name, require } = props;

  const [value, setValue] = useState<string[]>([]);
  const [input, setInput] = useState("");

  return (
    <Stack>
      <TextInput
        value={input}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (input) {
              setValue((v) => [...v, input]);
              setInput("");
              e.preventDefault();
            }
          }
        }}
      />
      <Group>
        {value.map((item, index) => {
          return (
            <Box key={item + index}>
              <Badge>{item}</Badge>
              <input
                name={name}
                value={value[index]}
                required={require}
                readOnly
              />
            </Box>
          );
        })}
      </Group>
    </Stack>
  );
};
