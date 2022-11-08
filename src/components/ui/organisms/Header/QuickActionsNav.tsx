import { Button, Center, HStack, Icon } from "@chakra-ui/react";
import { RiNotification2Line } from "react-icons/ri";
import ColorModeToggler from "../../molecules/ColorModeToggler";

export function QuickActionsNav() {

  return (
    <HStack
      spacing={"4"}
      mx={"4"}
    >
      <ColorModeToggler />
      <Button maxW={50} onClick={()=>{}}  variant='ghost'><Icon as={RiNotification2Line} /></Button>
    </HStack>
  );
}