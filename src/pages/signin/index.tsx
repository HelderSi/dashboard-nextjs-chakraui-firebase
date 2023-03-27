import type { NextPage } from "next";
import NextLink from "next/link";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "components/ui/atoms/Input";
import { Flex, HStack, Stack, Text, Center } from "@chakra-ui/layout";
import { FaInfoCircle } from 'react-icons/fa'

import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, useColorModeValue } from "@chakra-ui/react";
import DashboardLogo from "components/ui/atoms/DashboardLogo";
import { AUTH_ERROR_CODES, useAuth } from "../../contexts/AuthUserContext";
import { useRouter } from "next/router";
import ColorModeToggler from "components/ui/molecules/ColorModeToggler";
import { SocialLogin } from "components/ui/organisms/SocialLogin";
import { TextDivider } from "components/ui/atoms/TextDivider";
import { authConfig } from "../../configs/auth";
import { useCallback, useEffect } from "react";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido."),
  password: authConfig.email.withoutPassword ? yup.string().optional() : yup.string().required("Senha obrigatória."),
});

const SignIn: NextPage = () => {
  const {
    signInWithEmailAndPassword,
    sendSignInLinkToEmail,
    passwordRequiredForEmail,
    askEmailAgainForSignInFromLink,
    signInWithEmailLink,
    authError,
  } = useAuth();
  const { register, handleSubmit, formState, getValues } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
    defaultValues: {
      email: passwordRequiredForEmail || ""
    }
  });
  const { errors } = formState;
  const router = useRouter()

  const handleSignIn = async (values: SignInFormData) => {
    if (askEmailAgainForSignInFromLink && authError?.code !== AUTH_ERROR_CODES.INVALID_OOB_CODE) {
      localStorage.setItem('emailForSignIn', values.email);
      signInWithEmailLink();
      return;
    }
    if (authError?.code === AUTH_ERROR_CODES.INVALID_OOB_CODE) {
      await sendSignInLinkToEmail(values.email)
      return;
    }
    if (!isPasswordRequired()) {
      await sendSignInLinkToEmail(values.email)
      return;
    }

    signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        router.push('/')
      })
  };

  const isPasswordRequired = useCallback(() => {
    return passwordRequiredForEmail || !authConfig.email.withoutPassword
  }, [passwordRequiredForEmail, authConfig.email.withoutPassword])

  if (askEmailAgainForSignInFromLink) {
    return <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        onSubmit={handleSubmit(handleSignIn)}
        width="100%"
        maxWidth={360}
        bg={useColorModeValue("gray.50", "gray.700")}
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Center>
            <DashboardLogo />
          </Center>
          {authError &&
            <Alert status='error' borderRadius={'md'}>
              <AlertIcon />
              <AlertTitle>{authError.title}</AlertTitle>
              <AlertDescription>{authError.message}</AlertDescription>
            </Alert>}
          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            autoFocus={true}
            {...register("email")}
          />
        </Stack>

        <Button
          type="submit"
          mt="4"
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          {authError?.code === AUTH_ERROR_CODES.INVALID_OOB_CODE ? 'Enviar link novamente' : 'Entrar'}
        </Button>
      </Flex>
    </Flex>
  }
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        onSubmit={handleSubmit(handleSignIn)}
        width="100%"
        maxWidth={360}
        bg={useColorModeValue("gray.50", "gray.700")}
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Center>
            <DashboardLogo />
          </Center>
          {
            authConfig.social.enabled && !passwordRequiredForEmail &&
            <>
              <SocialLogin />
              <TextDivider text="ou" />
            </>
          }

          {passwordRequiredForEmail &&
            <HStack>
              <FaInfoCircle color='tomato' size={32} />
              <Text as='b' color='tomato'>
                Você já possui um conta cadastrada! Digite sua senha para continuar.
              </Text>
            </HStack>}
          {passwordRequiredForEmail || <Input
            type="email"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />}

          {passwordRequiredForEmail &&
            <HStack>
              <Text as='b'>
                Email:
              </Text>
              <Text as='b'>
                {passwordRequiredForEmail}
              </Text>
            </HStack>}

          {isPasswordRequired() &&
            <Input
              type="password"
              label="Senha"
              error={errors.password}
              autoFocus={!!passwordRequiredForEmail}
              {...register("password")}
            />}
        </Stack>
        {isPasswordRequired() &&
          <Button
            alignSelf="flex-end"
            mt={2}
            as={"a"}
            fontSize={"sm"}
            fontWeight={600}
            variant={"link"}
            href={`/forgot-pw${passwordRequiredForEmail ? `?email=${passwordRequiredForEmail}` : ""}`}
          >
            Esqueceu sua senha?
          </Button>}

        <Button
          type="submit"
          mt="4"
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
        {passwordRequiredForEmail && <Button
          mt="4"
          variant='ghost'
          size="lg"
          isLoading={formState.isSubmitting}
          as="a"
          href={`/signin`}
        >
          Entrar com outra conta
        </Button>}
        {!!passwordRequiredForEmail || <HStack mt={4}>
          <Text>Não possui uma conta?</Text>
          <Button
            fontSize={"sm"}
            fontWeight={600}
            variant={"link"}
            href={"/signup"}
            as={NextLink}
          >
            Cadastre-se
          </Button>
        </HStack>}
        <Center mt='6'>
          <ColorModeToggler />
        </Center>
      </Flex>
    </Flex>
  );
};

export default SignIn;
