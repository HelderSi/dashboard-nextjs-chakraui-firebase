import { Avatar, AvatarBadge, Box, Button, Center, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { RiNotification2Line, RiSearchLine } from "react-icons/ri";
import ColorModeToggler from "../../molecules/ColorModeToggler";

export function QuickActionsNav() {

  return (
    <HStack
      spacing={["2", "4"]}
    >
      <Button onClick={() => { }} variant='ghost' borderRadius={"50%"} w={8}>
        <Icon w={6} h={6} as={RiSearchLine} />
      </Button>
      <Button onClick={() => { }} variant='ghost' borderRadius={"50%"} w={8}>
        <Icon w={6} h={6} as={RiNotification2Line} />
        <Box position="absolute" right="1" bottom="0" borderRadius={"50%"} bgColor="red.500" h="2" w="2" />
      </Button>
    </HStack >
  );
}