import {
  Stack,
} from '@chakra-ui/layout';
import { Button } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaGoogle, FaGithub, FaApple } from 'react-icons/fa'
import { useAuth, SocialLoginProviders, SocialLoginProviderIds } from '../../../../contexts/AuthUserContext';

export function SocialLogin() {
  const { signInWithSocialLogin } = useAuth();

  const handleSignInWithSocialLogin = (provider: keyof (typeof SocialLoginProviders)) => () => {
    signInWithSocialLogin(SocialLoginProviders[provider])
  }

  return <Stack p={2}>
    {SocialLoginProviders[SocialLoginProviderIds.GOOGLE].enabled &&
      <Button
        colorScheme='gray'
        leftIcon={<FaGoogle />}
        onClick={handleSignInWithSocialLogin(SocialLoginProviderIds.GOOGLE)}
      >
        Fazer login com o Google
      </Button>}
    {SocialLoginProviders[SocialLoginProviderIds.FACEBOOK].enabled &&
      <Button
        colorScheme='facebook'
        leftIcon={<FaFacebook />}
        onClick={handleSignInWithSocialLogin(SocialLoginProviderIds.FACEBOOK)}
      >
        Fazer login com o Facebook
      </Button>}

    {SocialLoginProviders[SocialLoginProviderIds.GITHUB].enabled
      &&
      <Button
        bg='black'
        color='white'
        _hover={{ bg: 'gray.800' }}
        leftIcon={<FaGithub />}
        onClick={handleSignInWithSocialLogin(SocialLoginProviderIds.GITHUB)}
      >
        Fazer login com o Github
      </Button>}
    {SocialLoginProviders[SocialLoginProviderIds.TWITTER].enabled
      &&
      <Button
        colorScheme='twitter'
        leftIcon={<FaTwitter />}
        onClick={handleSignInWithSocialLogin(SocialLoginProviderIds.TWITTER)}
      >
        Fazer login com o Twitter
      </Button>}
    {SocialLoginProviders[SocialLoginProviderIds.APPLE].enabled
      &&
      <Button
        bg='black'
        color='white'
        _hover={{ bg: 'gray.800' }}
        leftIcon={<FaApple />}
        onClick={handleSignInWithSocialLogin(SocialLoginProviderIds.APPLE)}
      >
        Fazer login com o Apple
      </Button>}
  </Stack>;
}