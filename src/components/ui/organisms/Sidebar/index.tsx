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
  Icon
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
    <VStack as="aside" w="48" mr="8" borderRightWidth={'thin'}>
      <DashboardLogo />
      <Box flex={1}>
        <SidebarNav />
      </Box>
      <Box w={"full"}>
        <Divider orientation='horizontal' my="4" />
        <VStack
          py="4"
          spacing={["6", "8"]}

        >
          <ColorModeToggler />
          <Icon as={RiNotification2Line} />
          <Profile showProfileData={false} />
        </VStack>
      </Box>
    </VStack>
  );
}