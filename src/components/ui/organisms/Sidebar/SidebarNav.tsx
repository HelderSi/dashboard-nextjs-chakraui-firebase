import {
    Box,
    VStack,
    Stack,
    Flex
} from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react'
import ColorModeToggler from '../../molecules/ColorModeToggler';
import { SidebarMainNav } from './SidebarMainNav';
import DashboardLogo from '../../atoms/DashboardLogo';

export function SidebarNav() {

    return (
        <Flex flexDirection={"column"} flex="1" w={"full"} h={"full"}>
            <Flex flex="1">
                <SidebarMainNav />
            </Flex>
            <Divider orientation='horizontal' />
            <Stack
                py="4"
                spacing={["6", "8"]}
                w={"full"}
            >
                <ColorModeToggler />
            </Stack>
        </Flex>
    );
}