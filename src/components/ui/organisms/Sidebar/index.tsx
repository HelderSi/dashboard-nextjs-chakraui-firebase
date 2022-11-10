import {
  Drawer,
  DrawerOverlay,
  useBreakpointValue,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
} from '@chakra-ui/react';
import { useSidebarDrawer } from 'src/contexts/SidebarDrawerContext';
import DashboardLogo from '../../atoms/DashboardLogo';
import { SidebarNav } from './SidebarNav';

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
          <DrawerContent>
            <DrawerHeader><DashboardLogo /></DrawerHeader>
            <DrawerCloseButton size={'lg'} />

            <DrawerBody>
              <SidebarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }

  return <VStack
    as="aside"
    align={"left"}
    boxShadow='2xl'
    h="100vh"
    px={["2", "4"]}
    minW="200"
    position={"sticky"}
    left={"0"}
    top={"0"}
    zIndex={999}
  >
    <DashboardLogo py="4" />
    <SidebarNav />
  </VStack>;
}