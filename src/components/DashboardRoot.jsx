import { Box, Flex, Heading, Icon, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import SidebarItem from "./ui/SidebarItem";
import { Bot, Users } from "lucide-react";

const DashboardRoot = () => {
  return (
    <Flex height="100vh" overflow="hidden">
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
          <Flex
            align="flex-start"
            flexDir="column"
            justify="flex-start"
            w="full"
          >
            <SidebarItem
              name="Боты"
              icon={<Icon as={Bot} w={6} h={6} />}
              link="/dashboard/bots"
            />
            <SidebarItem
              name="Пользователи"
              icon={<Icon as={Users} w={6} h={6} />}
              link="/dashboard/users"
            />
          </Flex>
        </VStack>
      </Flex>

      <Flex flex="1" overflowY="auto">
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default DashboardRoot;
