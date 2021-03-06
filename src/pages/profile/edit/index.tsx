import {useState, useEffect, useCallback} from 'react'
import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/components/ui/atoms/Input';
import { Flex, HStack, Stack, Text, Box, Center, Divider } from '@chakra-ui/layout';
import { Avatar, Heading, Spinner, useToast } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button';
import { Icon } from '@chakra-ui/icon';
import { useAuth } from 'src/contexts/AuthUserContext';
import { storage } from 'src/services/firebase'; 
import { RiErrorWarningLine } from "react-icons/ri";
import UserAvatarEditor from 'src/components/ui/molecules/UserAvatarEditor';

type ProfileFormData = {
    name: string;
};

const profileFormSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório')
})

const ProfileEdit: NextPage = () => {
    const [sendingVerificationEmail, setSendingVerificationEmail] = useState(false)
    const { register, handleSubmit, formState, setValue } = useForm({
        resolver: yupResolver(profileFormSchema)
    });
    const { errors } = formState;
    const { authUser, updateCurrentUserProfile, sendEmailVerification } = useAuth()

    const toast = useToast()

    useEffect(()=>{
        authUser?.displayName && setValue('name',  authUser.displayName)
    },[setValue, authUser])

    const handleUpdateProfile: SubmitHandler<ProfileFormData> = async (values) => {
        try{
            await updateCurrentUserProfile({displayName: values.name})
            toast({
                title: 'Sucesso',
                description: 'Seu perfil foi atualizado',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
              })
        }catch(err){
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

    const handleSendVerificationEmail = useCallback(()=>{
        setSendingVerificationEmail(true)
        sendEmailVerification().then( () => {
            setSendingVerificationEmail(false)
            toast({
                title: `Email enviado para ${authUser?.email}`,
                description: 'Acesse seu email e clique no link de verificação.',
                status: 'success',
                duration: null,
                isClosable: true,
                position: 'top'
              })
          }).catch( err => {
            console.log(err.message)
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

    console.log(authUser)
    const handleDeleteAvatarPhoto = useCallback(async ()=>{
        authUser?.photoURL && await storage.deleteObject(authUser.photoURL).then(()=>{
            updateCurrentUserProfile({
                photoURL: ''
            })
        })
    },[authUser, updateCurrentUserProfile])

    return (
        <Stack
            w="100vw"
            h="100vh"
            align="center"
            maxW='500'
        >   
            <Box m={8} w="100%">
                <Heading mb={4} size='md'>Informações públicas</Heading>
                <Divider />
            </Box>
            <Stack align="center">
                <Avatar m={4} src={authUser?.photoURL || ""} name={authUser?.displayName || ""} size='2xl'/>
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
            <Box w="100%">
                <Heading mb={4} size='md'>Configurações da conta</Heading>
                <Divider />
            </Box>
            <Box p={4}>
                <Text fontSize='lg'>E-mail: {authUser?.email}</Text>
                {
                    !authUser?.emailVerified && <>
                        <Flex align="center" justify='center'>
                            <Icon as={RiErrorWarningLine} color={'red.500'} mr={2}/>
                            <Text color={'red.500'}>Email não verificado!</Text>
                        </Flex>
                        <Button isLoading={sendingVerificationEmail} mt={4} colorScheme='blue' onClick={handleSendVerificationEmail}>Enviar e-mail de verificação</Button>
                    </>
                }
            </Box>
        </Stack>
    )
}

export default ProfileEdit;
