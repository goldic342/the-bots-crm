import React from "react";
import PropTypes from "prop-types";
import { Box, Divider, useColorModeValue } from "@chakra-ui/react";
import ActionRow from "./ActionRow";

const ActionGroup = ({ items }) => {
  const cardBg = useColorModeValue("gray.100", "gray.800");
  return (
    <Box bg={cardBg} borderRadius="xl" w="full" p={1}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ActionRow {...item} />
          {idx !== items.length - 1 && <Divider height={"2px"} />}
        </React.Fragment>
      ))}
    </Box>
  );
};

ActionGroup.propTypes = {
  items: PropTypes.array.isRequired,
};
export default ActionGroup;
