import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "src/components/ui/atoms/Input";
import { Flex, HStack, Stack, Text, Box, Center } from "@chakra-ui/layout";
import { Button, useColorModeValue } from "@chakra-ui/react";
import DashboardLogo from "src/components/ui/atoms/DashboardLogo";
import { useAuth } from "src/contexts/AuthUserContext";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import ColorModeToggler from "src/components/ui/molecules/ColorModeToggler";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido."),
  password: yup.string().required("Senha obrigatória."),
});

const SignIn: NextPage = () => {
  const { signInWithEmailAndPassword } = useAuth();
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;
  const router = useRouter()
  const toast = useToast()

  const handleSignIn =  (values: SignInFormData) => {
    signInWithEmailAndPassword(values.email, values.password)
      .then( () => {
        router.push('/')
      }).catch( err => {
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
        bg={useColorModeValue("gray.50","gray.700")}
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Center>
            <DashboardLogo />
          </Center>
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
        </Button>
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
