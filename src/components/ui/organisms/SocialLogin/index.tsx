import {
  Stack,
} from '@chakra-ui/layout';
import { Button } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaGoogle, FaGithub } from 'react-icons/fa'
import { AuthProviderIds } from "src/services/firebase/auth";
import { useAuth } from 'src/contexts/AuthUserContext';

export function SocialLogin() {
  const { signInWithSocialLogin } = useAuth();

  const handleSignInWithSocialLogin = (providerId: AuthProviderIds) => () => {
    signInWithSocialLogin(providerId)
  }

  return <Stack p={2}>
    <Button colorScheme='gray' leftIcon={<FaGoogle />} onClick={handleSignInWithSocialLogin(AuthProviderIds.GOOGLE)}>
      Fazer login com o Google
    </Button>
    <Button colorScheme='facebook' leftIcon={<FaFacebook />} onClick={handleSignInWithSocialLogin(AuthProviderIds.FACEBOOK)}>
      Fazer login com o Facebook
    </Button>
    <Button colorScheme='twitter' leftIcon={<FaTwitter />}>
      Fazer login com o Twitter
    </Button>
    <Button bg='black' color='white' _hover={{ bg: 'gray.800' }} leftIcon={<FaGithub />}>
      Fazer login com o Github
    </Button>
  </Stack>;
}