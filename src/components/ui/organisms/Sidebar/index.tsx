import {
  Box,
  Drawer,
  DrawerOverlay,
  useBreakpointValue,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react';
import { useSidebarDrawer } from 'src/contexts/SidebarDrawerContext';
import { SidebarNav } from './SidebarNav';

export function Sidebar() {
  const { isOpen, onClose } = useSidebarDrawer();

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false,
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
    <Box as="aside" w="48" mr="8">
      <SidebarNav />
    </Box>
  );
}