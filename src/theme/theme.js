import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
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
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "primary.500",
          color: "white",
          _hover: { bg: "primary.600" },
        },
        outline: {
          borderColor: "primary.300",
          color: "primary.500",
          borderWidth: "2px",
          _hover: { bg: "secondary" },
        },
      },
      defaultProps: {
        variant: "solid",
      },
    },
    Text: {
      baseStyle: {
        color: "gray.700",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "bold",
        color: "gray.900",
      },
    },
  },
  Input: {
    variants: {
      standard: {
        field: {
          borderColor: "gray.300",
          _focus: { borderColor: "primary.500", boxShadow: "outline" },
        },
      },
      blackBorder: {
        field: {
          borderColor: "black",
          borderWidth: "2px",
          _focus: { borderColor: "primary.500", boxShadow: "outline" },
        },
      },
    },
    defaultProps: {
      variant: "standard",
    },
  },
});

export default theme;
