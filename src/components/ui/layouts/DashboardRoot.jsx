import {
  Box,
  Flex,
  Heading,
  Icon,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarItem from "../SidebarItem";
import NoChatSelected from "../NoChatSelected";
import { Bot, Users } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import Logo from "../Logo";

const DashboardRoot = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const chatSelected =
    pathname.startsWith("/dashboard/bots") && !pathname.includes("/chat/");

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const { user } = useAuth();

  const sidebarItems = [
    {
      name: "Боты",
      icon: <Icon as={Bot} w={6} h={6} />,
      link: "/dashboard/bots",
    },
  ];

  if (user.role === "admin") {
    sidebarItems.push({
      name: "Пользователи",
      icon: <Icon as={Users} w={6} h={6} />,
      link: "/dashboard/users",
    });
  }

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
        <Box px={{ md: 3, lg: 6 }} pt={4} pr={{ md: 3, lg: 20 }}>
          {isTablet ? (
            <Logo />
          ) : (
            <Flex align={"center"} gap={3}>
              <Logo w={"42px"} h={"42px"} />
              <Heading size="md">BotsDash</Heading>
            </Flex>
          )}
        </Box>
        <Flex align="flex-start" flexDir="column" justify="flex-start" w="full">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.link}
              name={item.name}
              icon={item.icon}
              link={item.link}
              iconOnly={isTablet}
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
          borderRadius="full"
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
