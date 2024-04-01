import { Text, Box, Button, Group, Stack, TextInput } from "@mantine/core";
import { useCallback, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

type Props = {
  name: string;
  require?: boolean;
};

export const MultiInput = (props: Props) => {
  const { name, require } = props;

  const [value, setValue] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const deleteItem = useCallback((index: number) => {
    setValue((v) => [...v.slice(0, index), ...v.slice(index + 1)]);
  }, []);

  const mergeInputValue = useCallback(() => {
    setValue((v) => [...v, input]);
    setInput("");
  }, [input]);

  return (
    <Stack p="4px 4px 0 4px">
      <Group sx={{ alignItems: "end" }}>
        <TextInput
          value={input}
          autoFocus
          label="買うもの"
          placeholder="人参"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (input && !e.nativeEvent.isComposing) {
                mergeInputValue();
                e.preventDefault();
              }
            }
          }}
        />
        <Button onClick={() => mergeInputValue()}>追加</Button>
      </Group>
      <Group>
        {value.map((item, index) => {
          return (
            <Box key={item + index}>
              <Button
                sx={(theme) => ({
                  height: "fit-content",
                  backgroundColor: theme.colors.cyan[1],
                })}
                variant="outline"
                p="2px"
                onClick={() => deleteItem(index)}
              >
                <Text px="2px" sx={{ textTransform: "uppercase" }}>
                  {item}
                </Text>
                <Box px="2px">
                  <AiOutlineDelete />
                </Box>
              </Button>
              <input
                hidden
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
