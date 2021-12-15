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
} from "@chakra-ui/react";
import { useAuth } from "src/contexts/AuthUserContext";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { authUser, signOut, loading: loadingAuth } = useAuth()

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{authUser?.displayName || "Nome não informado"}</Text>
          <Text color="gray.300" fontSize="small">
            {authUser?.email}
          </Text>
        </Box>
      )}
      <Popover>
        <PopoverTrigger>
          <Avatar
            size="md"
            name={authUser?.displayName || ""}
            src={authUser?.photoURL || ""}
          />
        </PopoverTrigger>
        <PopoverContent mr="4">
          <PopoverArrow ml="2"/>
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
