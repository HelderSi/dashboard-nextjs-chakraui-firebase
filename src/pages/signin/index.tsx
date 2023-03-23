import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "components/ui/atoms/Input";
import { Flex, HStack, Stack, Text, Center } from "@chakra-ui/layout";
import { Button, useColorModeValue } from "@chakra-ui/react";
import DashboardLogo from "components/ui/atoms/DashboardLogo";
import { useAuth } from "../../contexts/AuthUserContext";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import ColorModeToggler from "components/ui/molecules/ColorModeToggler";
import { SocialLogin } from "components/ui/organisms/SocialLogin";
import { TextDivider } from "components/ui/atoms/TextDivider";
import { authConfig } from "../../configs/auth";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido."),
  password: authConfig.email.withoutPassword ? yup.string().optional() : yup.string().required("Senha obrigatória."),
});

const SignIn: NextPage = () => {
  const { signInWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailLink } = useAuth();
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;
  const router = useRouter()
  const toast = useToast()

  const handleSignIn = async (values: SignInFormData) => {
    if (authConfig.email.withoutPassword) {
      sendSignInLinkToEmail(values.email).catch(err => {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao logar',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'

        })
      })
      toast({
        title: 'Link enviado',
        description: 'Acesse seu email e clique no link para logar.',
        status: 'success',
        duration: null,
        isClosable: true,
        position: 'top'
      })
      return;
    }
    signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        router.push('/')
      }).catch(err => {
        console.log(err.message)
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao logar',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      })
  };

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
          {authConfig.social.enabled &&
            <>
              <SocialLogin />
              <TextDivider text="ou" />
            </>}

          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />

          {authConfig.email.withoutPassword ||
            <Input
              type="password"
              label="Senha"
              error={errors.password}
              {...register("password")}
            />}
        </Stack>
        {authConfig.email.withoutPassword ||
          <Button
            alignSelf="flex-end"
            mt={2}
            as={"a"}
            fontSize={"sm"}
            fontWeight={600}
            variant={"link"}
            href={"/forgot-pw"}
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
        <HStack mt={4}>
          <Text>Não possui uma conta?</Text>
          <Button
            as={"a"}
            fontSize={"sm"}
            fontWeight={600}
            variant={"link"}
            href={"/signup"}
          >
            Cadastre-se
          </Button>
        </HStack>
        <Center mt='6'>
          <ColorModeToggler />
        </Center>
      </Flex>
    </Flex>
  );
};

export default SignIn;
