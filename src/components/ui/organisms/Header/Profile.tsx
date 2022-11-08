import Link from 'next/link'
import {
  Flex,
  Box,
  Text,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  Button,
  VStack,
  Divider,
  HStack,
} from "@chakra-ui/react";

import { useAuth } from "src/contexts/AuthUserContext";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { authUser, signOut, loading: loadingAuth } = useAuth()

  return (
    <Flex align="center">
      <Popover placement='auto'>
        <PopoverTrigger>
          <HStack w={"full"}>
            <Avatar
              size="md"
              name={authUser?.displayName || ""}
              src={authUser?.photoURL || ""}
            />
            {showProfileData && (
              <Box ml="4" textAlign="left">
                <Text>{authUser?.displayName || "Nome não informado"}</Text>
                <Text color="gray.300" fontSize="small">
                  {authUser?.email}
                </Text>
              </Box>
            )}
          </HStack>
        </PopoverTrigger>

        <PopoverContent mr="4">
          <PopoverArrow ml="2" />
          <PopoverHeader>Perfil</PopoverHeader>
          <PopoverBody>
            <VStack alignItems="flex-start">
              <Link href={"/profile/edit"}>
                <Button variant="link">Editar</Button>
              </Link>
              <Link href={"/profile/change-pw"}>
                <Button variant="link" >Alterar senha</Button>
              </Link>
              <Divider />
              <Button variant="link" color="red.400" isLoading={loadingAuth} onClick={signOut}>
                Sair
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}
