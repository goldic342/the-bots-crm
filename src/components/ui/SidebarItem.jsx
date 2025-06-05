import {
  Link,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ name, icon, link, iconOnly = false, ...props }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const activeColor = useColorModeValue(
    "var(--chakra-colors-primary-600)",
    "var(--chakra-colors-primary-300)"
  );
  const activeBg = useColorModeValue(
    "var(--chakra-colors-primary-100)",
    "var(--chakra-colors-primary-700)"
  );

  return (
    <Link
      as={NavLink}
      to={link}
      {...props}
      display="flex"
      alignItems="center"
      w={{ base: 12, md: "full" }}
      gap={6}
      textDecoration="none"
      style={({ isActive }) => ({
        color: isActive ? activeColor : "inherit",
        background: isActive ? activeBg : "transparent",
        textDecoration: "none",
        padding: isMobile ? "var(--chakra-space-1)" : "12px 24px",
      })}
    >
      {icon}
      {!iconOnly && (
        <Text size="lg" color="inherit">
          {name}
        </Text>
      )}
    </Link>
  );
};

export default SidebarItem;
