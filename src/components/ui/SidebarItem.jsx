import { Link, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ name, icon, link, ...props }) => {
  // Can't use useState here, forced to use vanilla css
  return (
    <Link
      as={NavLink}
      to={link}
      {...props}
      display={"flex"}
      alignItems={"center"}
      w={"full"}
      gap={6}
      padding={"12px 24px"}
      textDecoration={"none"}
      transition={"background .1s ease-in"}
      style={({ isActive }) => ({
        color: isActive ? "var(--chakra-colors-primary-600)" : "inherit",
        background: isActive
          ? "var(--chakra-colors-primary-100)"
          : "transparent",
        textDecoration: "none", // For some reason working only here
      })}
    >
      {icon}
      <Text size="lg" color="inherit">
        {name}
      </Text>
    </Link>
  );
};

export default SidebarItem;
