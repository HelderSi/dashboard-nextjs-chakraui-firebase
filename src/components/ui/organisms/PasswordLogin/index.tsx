import NextLink from "next/link";
import {
    Button,
    Text,
    useToast,
    Stack
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "components/ui/atoms/Input";
import { useAuth } from "contexts/AuthUserContext";
import { useRouter } from "next/router";


interface PasswordLoginProps {
    initialValues?: {
        email?: string;
    }
}

type SignInFormData = {
    email: string;
    password: string;
};

const signInFormSchema = yup.object().shape({
    email: yup.string().required("E-mail obrigatório.").email("E-mail inválido."),
    password: yup.string().required("Senha obrigatória."),
});

export function PasswordLogin({
    initialValues,
}: PasswordLoginProps) {
    const { signInWithEmailAndPassword } = useAuth();
    const toast = useToast()
    const router = useRouter()

    const { register, handleSubmit, formState, getValues } = useForm<SignInFormData>({
        resolver: yupResolver(signInFormSchema),
        defaultValues: {
            email: initialValues?.email || "",
        }
    });
    const { errors } = formState;

    const handleSignIn = async (values: SignInFormData) => {
        signInWithEmailAndPassword(values.email, values.password)
            .then(() => {
                router.push('/')
            }).catch(err => {
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
        <Stack spacing="4" p={2} pb={4} as="form" onSubmit={handleSubmit(handleSignIn)}>
            <Text mb={4}>Você já possui uma conta cadastrada:</Text>
            <Input
                type="email"
                label="E-mail"
                error={errors.email}
                isDisabled={!!initialValues?.email}
                {...register("email")}
            />
            <Input
                type="password"
                label="Senha"
                error={errors.password}
                {...register("password")}
            />
            <Button
                alignSelf="flex-end"
                mt={2}
                as={NextLink}
                fontSize={"sm"}
                fontWeight={600}
                variant={"link"}
                href={`/forgot-pw?email=${getValues().email}`}
            >
                Esqueceu sua senha?
            </Button>
            <Button
                type="submit"
                colorScheme="green"
                size="lg"
                isLoading={formState.isSubmitting}
            >
                Entrar
            </Button>
        </Stack>
    );
}
