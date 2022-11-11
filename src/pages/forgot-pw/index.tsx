import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/components/ui/atoms/Input';
import { Flex, HStack, Stack, Text, Box, Heading } from '@chakra-ui/layout';
import { Button, useColorModeValue } from '@chakra-ui/react';
import DashboardLogo from 'src/components/ui/atoms/DashboardLogo';
import { useAuth } from 'src/contexts/AuthUserContext';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/toast';

type SignInFormData = {
  email: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório.').email('E-mail inválido.'),
})

const ForgotPassword: NextPage = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });
  const { errors } = formState;

  const { sendPasswordResetEmail } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const handleSendPasswordResetEmail: SubmitHandler<SignInFormData> = async (values) => {
    await sendPasswordResetEmail(values.email)
      .then(() => {
        toast({
          title: 'Concluído',
          description: `Um email de recuperação de senha foi enviado para ${values.email}`,
          status: 'success',
          duration: null,
          isClosable: true,
          position: 'top'
        })
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
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        onSubmit={handleSubmit(handleSendPasswordResetEmail)}
        width="100%"
        maxWidth={360}
        bg={useColorModeValue("gray.50", "gray.700")}
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Box align='center' mb={4}>
            <DashboardLogo />
          </Box>
          <Heading size='md'>Informe o e-mail cadastrado.</Heading>
          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />
        </Stack>
        <Button
          type="submit"
          mt="8"
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Recuperar senha
        </Button>
        <Button
          mt={8}
          as={'a'}
          fontSize={'sm'}
          fontWeight={600}
          variant={'link'}
          href={'/signin'}>
          Voltar ao login
        </Button>
      </Flex>
    </Flex>
  )
}

export default ForgotPassword;
