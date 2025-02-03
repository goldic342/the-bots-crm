import { Link, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useBreakpointValue } from "@chakra-ui/react";

const SidebarItem = ({ name, icon, link, iconOnly = false, ...props }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

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
      p={"12px 24px"}
      style={({ isActive }) => ({
        // Fucking hate this styling.
        // how I even supposed to style this shit
        color: isActive ? "var(--chakra-colors-primary-600)" : "inherit",
        background: isActive
          ? "var(--chakra-colors-primary-100)"
          : "transparent",

        textDecoration: "none",
        padding: isMobile && "var(--chakra-space-1)",
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
