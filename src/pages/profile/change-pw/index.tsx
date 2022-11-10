import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Input } from "src/components/ui/atoms/Input";
import { Stack, Box } from "@chakra-ui/layout";
import { useColorModeValue, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { useAuth } from "src/contexts/AuthUserContext";

type ProfileFormData = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const formSchema = yup.object().shape({
  oldPassword: yup.string().required("Campo obrigatório"),
  newPassword: yup.string().required("Campo obrigatório"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Senha não confere").required("Campo obrigatório"),
});

const ChangePassword: NextPage = () => {
  const { register, handleSubmit, formState, setValue, watch } = useForm({
    resolver: yupResolver(formSchema),
  });
  const { errors } = formState;
  const { updateCurrentUserPassword } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700')

  const toast = useToast();

  const handleUpdatePassword: SubmitHandler<ProfileFormData> = async (
    values
  ) => {
    try {
      await updateCurrentUserPassword(values.oldPassword, values.newPassword);
      toast({
        title: "Sucesso",
        description: "Senha atualizada",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Stack w="full" align="center" justify="start" mt="6">
      <Box
        as="form"
        onSubmit={handleSubmit(handleUpdatePassword)}
        w="100%"
        p="8"
        maxW="500"
        boxShadow='xs' rounded='md'
        bgColor={cardBg}
      >
        <Input
          label="Senha antiga"
          maxW={600}
          type="password"
          error={errors.oldPassword}
          {...register("oldPassword")}
        />
        <Input
          label="Nova senha"
          maxW={600}
          type="password"
          error={errors.newPassword}
          {...register("newPassword")}
        />
        <Input
          label="Confirmar nova senha"
          maxW={600}
          type="password"
          error={errors.confirmNewPassword}
          {...register("confirmNewPassword")}
        />

        <Button
          type="submit"
          mt="6"
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
          w="100%"
        >
          Salvar
        </Button>
      </Box>
    </Stack>
  );
};

export default ChangePassword;
