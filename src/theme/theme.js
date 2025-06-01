import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// Configure initial color mode and system preference
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    primary: {
      100: "#D6EBFF",
      200: "#ADD7FF",
      300: "#85C3FF",
      400: "#5CAFFF",
      500: "#0079FF", // Base color
      600: "#0063CC",
      700: "#004D99",
      800: "#003666",
      900: "#002033",
    },
    secondary: "#E5F1FF",
    accent: "#FFA500",
    dark: "#1A202C",
    light: "#F7FAFC",
  },
  fonts: {
    body: "Lato, sans-serif",
    heading: "Lato, sans-serif",
  },

  components: {
    Button: {
      baseStyle: (props) => ({
        fontWeight: "bold",
        borderRadius: "md",
      }),
      variants: {
        solid: (props) => ({
          bg: mode("primary.500", "primary.600")(props),
          color: "white",
          _hover: { bg: mode("primary.600", "primary.300")(props) },
        }),
        outline: (props) => ({
          borderColor: mode("primary.300", "primary.500")(props),
          fontWeight: "semibold",
          color: mode("primary.500", "primary.400")(props),
          borderWidth: "1px",
          _hover: { bg: mode("secondary", "gray.700")(props) },
        }),
        alert: {
          bg: "red.500",
          _hover: { bg: "red.300" },
        },
      },
      defaultProps: {
        variant: "solid",
      },
    },
    Text: {
      baseStyle: (props) => ({
        color: mode("gray.700", "gray.200")(props),
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        fontWeight: "bold",
        color: mode("gray.900", "whiteAlpha.900")(props),
      }),
    },
    Input: {
      variants: {
        standard: (props) => ({
          field: {
            borderWidth: "1px",
            bg: mode("normal", "gray.700")(props),
            borderColor: mode("gray.300", "gray.600")(props),
            _focus: { borderColor: "primary.500", boxShadow: "outline" },
          },
        }),
        blackBorder: (props) => ({
          field: {
            borderColor: mode("black", "whiteAlpha.500")(props),
            borderWidth: "2px",
            _focus: { borderColor: "primary.500", boxShadow: "outline" },
          },
        }),
      },
      defaultProps: {
        variant: "standard",
      },
    },
  },
});

export default theme;
