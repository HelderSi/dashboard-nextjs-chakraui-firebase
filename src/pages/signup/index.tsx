import type { NextPage } from "next";
import NextLink from "next/link";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Input } from "src/components/ui/atoms/Input";
import { Flex, HStack, Stack, Text, Box, Heading } from "@chakra-ui/layout";
import { Button, useColorModeValue } from "@chakra-ui/react";
import DashboardLogo from "src/components/ui/atoms/DashboardLogo";
import { useAuth } from "src/contexts/AuthUserContext";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/toast";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido."),
  password: yup.string().required("Senha obrigatória."),
});

const SignUp: NextPage = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;

  const { createUserWithEmailAndPassword } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSignUp: SubmitHandler<SignInFormData> = async (values) => {
    await createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        console.log(err.message);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao logar",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });
  };

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        onSubmit={handleSubmit(handleSignUp)}
        width="100%"
        maxWidth={360}
        bg={useColorModeValue("gray.50", "gray.700")}
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Box align="center" mb={4}>
            <DashboardLogo />
          </Box>
          <Heading size="md">
            Vamos lá! o cadastro leva poucos segundos.
          </Heading>
          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />

          <Input
            type="password"
            label="Senha"
            error={errors.password}
            {...register("password")}
          />
        </Stack>
        {/* <Text>Sua senha deve ter no mínimo 6 caracteres</Text> */}
        <Button
          type="submit"
          mt="8"
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Criar conta
        </Button>
        <HStack mt={4}>
          <Text>Você já tem uma conta?</Text>
          <NextLink href={"/signin"} passHref>
            <Button as={"a"} fontSize={"sm"} fontWeight={600} variant={"link"}>
              Entrar
            </Button>
          </NextLink>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default SignUp;
