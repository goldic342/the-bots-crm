import {
  Box,
  Flex,
  Heading,
  Icon,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarItem from "./ui/SidebarItem";
import NoChatSelected from "./ui/NoChatSelected";
import { Bot, Users } from "lucide-react";

const DashboardRoot = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const chatSelected =
    pathname.startsWith("/dashboard/bots") && !pathname.includes("/chat/");

  const isMobile = useBreakpointValue({ base: true, md: false });

  const sidebarItems = [
    {
      name: "Боты",
      icon: <Icon as={Bot} w={6} h={6} />,
      link: "/dashboard/bots",
    },
    {
      name: "Пользователи",
      icon: <Icon as={Users} w={6} h={6} />,
      link: "/dashboard/users",
    },
  ];

  const DesktopSidebar = () => (
    <Flex
      border="1px"
      borderColor="gray.200"
      width="max-content"
      height="100vh"
      position="sticky"
      top="0"
      left="0"
    >
      <VStack spacing={6} align="flex-start">
        <Box px={6} pt={4} pr={20}>
          <Heading size="md">Bots Dashboard</Heading>
        </Box>
        <Flex align="flex-start" flexDir="column" justify="flex-start" w="full">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.link}
              name={item.name}
              icon={item.icon}
              link={item.link}
            />
          ))}
        </Flex>
      </VStack>
    </Flex>
  );

  const MobileSidebar = () => (
    <Flex
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
      justifyContent="space-around"
      p={2}
    >
      {sidebarItems.map((item) => (
        <SidebarItem
          key={item.link}
          name={item.name}
          icon={item.icon}
          link={item.link}
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={2}
          py={1}
          fontSize="xs"
          textAlign="center"
          borderRadius="full" // Rounded menu items
          _hover={{
            bg: "gray.100",
          }}
          iconOnly
        />
      ))}
    </Flex>
  );

  return (
    <Flex
      height="100vh"
      overflow="hidden"
      position="relative"
      direction={{ base: "column", md: "row" }}
    >
      {!isMobile && <DesktopSidebar />}

      <Flex flex="1" overflowY="auto">
        <Outlet />
        {!isMobile && chatSelected && <NoChatSelected />}
      </Flex>

      {isMobile && <MobileSidebar />}
    </Flex>
  );
};

export default DashboardRoot;
