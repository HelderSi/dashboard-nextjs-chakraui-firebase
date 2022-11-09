import { Flex, useBreakpointValue, IconButton, Icon, Divider } from '@chakra-ui/react'
import { RiMenuLine } from 'react-icons/ri';
import { useSidebarDrawer } from 'src/contexts/SidebarDrawerContext';
import { QuickActionsNav } from './QuickActionsNav';
import { Profile } from './Profile';

export function Header() {
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  return (
    <Flex
      as="header"
      mt="2"
      pb='2'
      align="center"
      position={"sticky"}
      top={"0"}
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          ml="4"
        >
        </IconButton>
      )}
      <Flex
        align="center"
        ml="auto"
        pr="4"
      >
        <QuickActionsNav />
        <Divider orientation='vertical' my="8" mx="4" />
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}