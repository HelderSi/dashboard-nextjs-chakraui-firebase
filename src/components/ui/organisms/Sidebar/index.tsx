import {
  Box,
  Drawer,
  DrawerOverlay,
  useBreakpointValue,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  Icon,
  Stack
} from '@chakra-ui/react';
import { useSidebarDrawer } from 'src/contexts/SidebarDrawerContext';
import { Divider } from '@chakra-ui/react'
import ColorModeToggler from '../../molecules/ColorModeToggler';
import { SidebarNav } from './SidebarNav';
import { RiNotification2Line } from "react-icons/ri";
import { Profile } from '../Header/Profile';
import DashboardLogo from '../../atoms/DashboardLogo';

export function Sidebar() {
  const { isOpen, onClose } = useSidebarDrawer();

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false,
  })

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  if (isDrawerSidebar) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg="gray.800" p="4">
            <DrawerCloseButton mt="6" />
            <DrawerHeader>Navegação</DrawerHeader>

            <DrawerBody>
              <SidebarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }

  return (
    <VStack as="aside"  boxShadow='2xl'>
      <DashboardLogo />
      <Box flex={1} w={"full"} px={["4", "8"]}>
        <SidebarNav />
      </Box>
      <Divider orientation='horizontal' mx="4" />
      <Box w={"full"}>
        <Stack
          py="4"
          spacing={["6", "8"]} 
          w={"full"} 
          px="4"
        >
          <ColorModeToggler />
        </Stack>
      </Box>
    </VStack>
  );
}