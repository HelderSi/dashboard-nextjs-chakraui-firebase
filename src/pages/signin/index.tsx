import type { NextPage } from "next";
import NextLink from "next/link";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "components/ui/atoms/Input";
import { Flex, HStack, Stack, Text, Center } from "@chakra-ui/layout";

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, useColorModeValue } from "@chakra-ui/react";
import DashboardLogo from "components/ui/atoms/DashboardLogo";
import { useAuth } from "../../contexts/AuthUserContext";
import ColorModeToggler from "components/ui/molecules/ColorModeToggler";
import { SocialLogin } from "components/ui/organisms/SocialLogin";
import { TextDivider } from "components/ui/atoms/TextDivider";
import { authConfig } from "../../configs/auth";
import { useCallback } from "react";

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
    authState
  } = useAuth();
  const { register, handleSubmit, formState, } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
    defaultValues: {
      email: authState?.emailInput.initialValue || ""
    }
  });
  const { errors } = formState;


  const submitHandler = useCallback(async (values: SignInFormData) => {
    switch (authState?.submit.action) {
      case 'signInWithPassword':
        await signInWithEmailAndPassword(values.email, values.password)
      case 'sendSignInLinkToEmail':
        await sendSignInLinkToEmail(values.email)
      case 'sendSignInLinkToEmail':
        await sendSignInLinkToEmail(values.email)
    }
  }, [
    authState?.submit.action,
    signInWithEmailAndPassword,
    sendSignInLinkToEmail,
    sendSignInLinkToEmail
  ])

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        onSubmit={handleSubmit(submitHandler)}
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
          {authState?.alert &&
            <Alert status={authState.alert.severity} borderRadius={'md'}>
              <AlertIcon />
              <Box>
                <AlertTitle>{authState.alert.title}</AlertTitle>
                <AlertDescription>
                  {authState.alert.message}
                </AlertDescription>
              </Box>
            </Alert>}
          {
            authState?.socialLogin.disabled ||
            <>
              <SocialLogin />
              <TextDivider text="ou" />
            </>
          }

          {authState?.passwordInput.requiredForEmail &&
            <Alert status='warning' borderRadius={'md'}>
              <AlertIcon />
              <Box>
                <AlertTitle>Você já possui um conta cadastrada!</AlertTitle>
                <AlertDescription>
                  Digite sua senha para continuar
                </AlertDescription>
              </Box>
            </Alert>

          }
          {authState?.emailInput.disabled ||
            <Input
              type="email"
              label="E-mail"
              autoFocus={authState?.code === 'EMAIL_REQUIRED_FOR_SIGN_IN_FROM_LINK'}
              error={errors.email}
              {...register("email")}
            />}

          {authState?.passwordInput.requiredForEmail &&
            <HStack>
              <Text as='b'>
                Email:
              </Text>
              <Text as='b'>
                {authState.passwordInput.requiredForEmail}
              </Text>
            </HStack>}

          {authState?.passwordInput.disabled ||
            <Input
              type="password"
              label="Senha"
              error={errors.password}
              autoFocus={!!authState?.passwordInput.requiredForEmail}
              {...register("password")}
            />}
        </Stack>
        {authState?.passwordInput.disabled ||
          <Button
            alignSelf="flex-end"
            mt={2}
            as={"a"}
            fontSize={"sm"}
            fontWeight={600}
            variant={"link"}
            href={`/forgot-pw${authState?.passwordInput.requiredForEmail ? `?email=${authState?.passwordInput.requiredForEmail}` : ""}`}
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
          {authState?.submit.title}
        </Button>
        {!!authState?.passwordInput.requiredForEmail && <Button
          mt="4"
          variant='ghost'
          size="lg"
          isLoading={formState.isSubmitting}
          as="a"
          href={`/signin`}
        >
          Entrar com outra conta
        </Button>}
        {!!authState?.passwordInput.requiredForEmail || <HStack mt={4}>
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
