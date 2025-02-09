import { Switch, FormControl, FormLabel, useColorMode } from "@chakra-ui/react";

const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent={"space-between"}
    >
      <FormLabel htmlFor="dark-mode" mb="0">
        Темная тема
      </FormLabel>
      <Switch
        id="dark-mode"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
    </FormControl>
  );
};

export default ColorModeSwitcher;
