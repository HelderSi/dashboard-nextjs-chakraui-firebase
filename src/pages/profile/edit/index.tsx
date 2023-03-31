import { useState, useEffect, useCallback } from 'react'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/ui/atoms/Input';
import { Flex, Stack, Text, Box } from '@chakra-ui/layout';
import { Avatar, Heading, useColorModeValue, useToast } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button';
import { Icon } from '@chakra-ui/icon';
import { useAuth } from 'contexts/AuthUserContext';
import { storage } from 'services/firebase';
import { RiErrorWarningLine } from "react-icons/ri";
import UserAvatarEditor from 'components/ui/molecules/UserAvatarEditor';

type ProfileFormData = {
    name: string;
};

const profileFormSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório')
})

const ProfileEdit: NextPage = () => {
    const [sendingVerificationEmail, setSendingVerificationEmail] = useState(false)
    const { register, handleSubmit, formState, setValue } = useForm<ProfileFormData>({
        resolver: yupResolver(profileFormSchema)
    });
    const { errors } = formState;
    const { authUser, updateCurrentUserProfile, sendEmailVerification } = useAuth()
    const cardBg = useColorModeValue('white', 'gray.700')

    const toast = useToast()

    useEffect(() => {
        authUser?.displayName && setValue('name', authUser.displayName)
    }, [setValue, authUser])

    const handleUpdateProfile = async (values: ProfileFormData) => {
        try {
            await updateCurrentUserProfile({ displayName: values.name })
            toast({
                title: 'Sucesso',
                description: 'Seu perfil foi atualizado',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        } catch (err) {
            toast({
                title: 'Erro',
                description: 'Ocorreu um erro ao salvar',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }
    }

    const handleSendVerificationEmail = useCallback(() => {
        setSendingVerificationEmail(true)
        sendEmailVerification().then(() => {
            setSendingVerificationEmail(false)
            toast({
                title: `Email enviado para ${authUser?.email}`,
                description: 'Acesse seu email e clique no link de verificação.',
                status: 'success',
                duration: null,
                isClosable: true,
                position: 'top'
            })
        }).catch(err => {
            setSendingVerificationEmail(false)
            toast({
                title: 'Erro',
                description: 'Ocorreu um erro ao enviar',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        })
    }, [toast, authUser])

    const handleDeleteAvatarPhoto = useCallback(async () => {
        authUser?.photoURL && (await storage.deleteObject(authUser.photoURL).then(() => {
            updateCurrentUserProfile({
                photoURL: ''
            })
        }))
    }, [authUser, updateCurrentUserProfile])

    return (
        <Stack w="full" align="center" justify="start">
            <Box
                w="100%"
                pb="6"
                pt="2"
                maxW="500"
            >
                <Box w="100%" pt="6" pb="4">
                    <Heading size='md'>Informações públicas</Heading>
                </Box>
                <Box p="8" boxShadow='xs' rounded='md' bgColor={cardBg}>
                    <Stack align="center">
                        <Avatar m={4} src={authUser?.photoURL || ""} name={authUser?.displayName || ""} size='2xl' />
                        <UserAvatarEditor />
                        <Button m={4} colorScheme='red' variant="link" onClick={handleDeleteAvatarPhoto}>Remover</Button>
                    </Stack>
                    <Box
                        as="form"
                        onSubmit={handleSubmit(handleUpdateProfile)}
                        w="100%"
                        pb='6'
                    >
                        <Input
                            label="Nome"
                            maxW={600}
                            error={errors.name}
                            {...register('name')}
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
                </Box>
                <Box w="100%" pt="6" pb="4">
                    <Heading size='md'>Configurações da conta</Heading>
                </Box>
                <Box p="8" boxShadow='xs' rounded='md' bgColor={cardBg}>
                    <Text fontSize='lg'>E-mail: {authUser?.email}</Text>
                    {
                        !authUser?.emailVerified && <>
                            <Flex align="center" justify='center'>
                                <Icon as={RiErrorWarningLine} color={'red.500'} mr={2} />
                                <Text color={'red.500'}>Email não verificado!</Text>
                            </Flex>
                            <Button isLoading={sendingVerificationEmail} mt={4} colorScheme='blue' onClick={handleSendVerificationEmail}>Enviar e-mail de verificação</Button>
                        </>
                    }
                </Box>
            </Box>
        </Stack>
    )
}

export default ProfileEdit;
