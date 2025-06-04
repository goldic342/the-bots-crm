import { memo, useState } from "react";
import { HStack, Text, useClipboard, useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";

const Row = memo(function Row({
  label,
  value,
  copyable,
  onClick,
  color,
  hoverBg,
}) {
  const { onCopy } = useClipboard(String(value));
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleClick = () => {
    if (copyable) {
      onCopy();
      setCopied(true);
      toast({
        title: "Скопированно!",
        status: "success",
        duration: 800,
        isClosable: true,
      });
      setTimeout(() => setCopied(false), 700);
    }
    onClick?.();
  };

  return (
    <HStack
      justifyContent="space-between"
      px={2}
      py={1}
      borderRadius="md"
      cursor={copyable || onClick ? "pointer" : "default"}
      _hover={{ bg: (copyable || onClick) && hoverBg }}
      transition="background 0.2s"
      onClick={handleClick}
    >
      <Text fontWeight="medium">{label}:</Text>

      <HStack spacing={1} maxW="60%">
        <Text
          color={color || "gray.600"}
          fontFamily="mono"
          fontSize="sm"
          isTruncated
        >
          {value}
        </Text>
      </HStack>
    </HStack>
  );
});

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  copyable: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  hoverBg: PropTypes.string.isRequired,
};

export default Row;
