import { Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ name, icon, link }) => {
  return (
    <NavLink
      to={link}
      // There is not way to use internal chakra styles with NavLink
      // So I go dirty and write plain css but with chakra vars
      // TODO: use useState for styles
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "16px",
        padding: "12px 24px",
        textDecoration: "none",
        transition: "background .1s ease-in",
        color: isActive ? "var(--chakra-colors-primary-600)" : "inherit",
        background: isActive
          ? "var(--chakra-colors-primary-100)"
          : "transparent",
      })}
    >
      {icon}
      <Text size="lg" color="inherit">
        {name}
      </Text>
    </NavLink>
  );
};

export default SidebarItem;
