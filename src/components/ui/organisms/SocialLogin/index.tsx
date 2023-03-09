import {
  Stack,
} from '@chakra-ui/layout';
import { Button } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaGoogle, FaGithub, FaApple } from 'react-icons/fa'
import { SocialLoginProviders, SocialLoginProviderIds } from "src/services/firebase/auth";
import { useAuth } from 'src/contexts/AuthUserContext';
import { socialLoginConfig } from '../../../../configs/socialLogin';

export function SocialLogin() {
  const { signInWithSocialLogin } = useAuth();

  const handleSignInWithSocialLogin = (providerId: SocialLoginProviderIds) => () => {
    signInWithSocialLogin(providerId)
  }

  return <Stack p={2}>
    {socialLoginConfig.google.enabled && <Button colorScheme='gray' leftIcon={<FaGoogle />} onClick={handleSignInWithSocialLogin(SocialLoginProviders.GOOGLE)}>
      Fazer login com o Google
    </Button>}
    {socialLoginConfig.facebook.enabled && <Button colorScheme='facebook' leftIcon={<FaFacebook />} onClick={handleSignInWithSocialLogin(SocialLoginProviders.FACEBOOK)}>
      Fazer login com o Facebook
    </Button>}
    {socialLoginConfig.github.enabled && <Button bg='black' color='white' _hover={{ bg: 'gray.800' }} leftIcon={<FaGithub />} onClick={handleSignInWithSocialLogin(SocialLoginProviders.GITHUB)}>
      Fazer login com o Github
    </Button>}
    {socialLoginConfig.twitter.enabled && <Button colorScheme='twitter' leftIcon={<FaTwitter />} onClick={handleSignInWithSocialLogin(SocialLoginProviders.TWITTER)}>
      Fazer login com o Twitter
    </Button>}
    {socialLoginConfig.apple.enabled && <Button bg='black' color='white' _hover={{ bg: 'gray.800' }} leftIcon={<FaApple />} onClick={handleSignInWithSocialLogin(SocialLoginProviders.APPLE)}>
      Fazer login com o Apple
    </Button>}
  </Stack>;
}