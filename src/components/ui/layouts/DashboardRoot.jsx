import {
  Box,
  Flex,
  Heading,
  Icon,
  VStack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import CRLink from "../CRLink";
import SidebarItem from "../SidebarItem";
import NoChatSelected from "../NoChatSelected";
import { Bot, Users, Settings } from "lucide-react"; // Added Settings icon
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

  const primarySidebarItems = [
    {
      name: "Боты",
      icon: <Icon as={Bot} w={6} h={6} />,
      link: "/dashboard/bots",
    },
  ];

  if (user.role === "admin") {
    primarySidebarItems.push({
      name: "Пользователи",
      icon: <Icon as={Users} w={6} h={6} />,
      link: "/dashboard/users",
    });
  }

  const settingsSidebarItem = {
    name: "Настройки",
    icon: <Icon as={Settings} w={6} h={6} />,
    link: "/dashboard/settings",
  };

  const DesktopSidebar = () => (
    <Flex
      border="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      width="max-content"
      height="100vh"
      position="sticky"
      top="0"
      left="0"
    >
      <VStack
        spacing={6}
        align="flex-start"
        justify="space-between"
        height="100vh"
        w="full"
        py={4}
      >
        <Box w="full">
          <Box px={{ md: 3, lg: 6 }} pb={4}>
            {isTablet ? (
              <CRLink to={"/dashboard"}>
                <Logo />
              </CRLink>
            ) : (
              <CRLink to={"/dashboard"}>
                <Flex align="center" gap={3}>
                  <Logo w="42px" h="42px" />
                  <Heading size="md">BotsDash</Heading>
                </Flex>
              </CRLink>
            )}
          </Box>
          <Flex direction="column" gap={2}>
            {primarySidebarItems.map((item) => (
              <SidebarItem
                key={item.link}
                name={item.name}
                icon={item.icon}
                link={item.link}
                iconOnly={isTablet}
              />
            ))}
          </Flex>
        </Box>
        <Box w="full">
          <SidebarItem
            key={settingsSidebarItem.link}
            name={settingsSidebarItem.name}
            icon={settingsSidebarItem.icon}
            link={settingsSidebarItem.link}
            iconOnly={isTablet}
          />
        </Box>
      </VStack>
    </Flex>
  );

  // Mobile Sidebar: Combine primary and settings items in one bottom bar.
  const mobileSidebarItems = [...primarySidebarItems, settingsSidebarItem];

  const MobileSidebar = () => (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      borderTop="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-around"
      p={2}
    >
      {mobileSidebarItems.map((item) => (
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
            bg: useColorModeValue("gray.100", "gray.700"),
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
