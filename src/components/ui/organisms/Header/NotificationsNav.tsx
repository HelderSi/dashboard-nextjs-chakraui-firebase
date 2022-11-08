import { HStack, Icon } from "@chakra-ui/react";
import { RiNotification2Line } from "react-icons/ri";
import ColorModeToggler from "../../molecules/ColorModeToggler";

export function NotificationsNav() {

  return (
    <HStack
      spacing={["6", "8"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.400"
    >
      <ColorModeToggler />
      <Icon as={RiNotification2Line} />
    </HStack>
  );
}