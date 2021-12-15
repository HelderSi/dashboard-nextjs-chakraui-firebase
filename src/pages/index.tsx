import { useEffect } from 'react'
import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/components/ui/atoms/Input';
import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react'
import { useAuth } from 'src/contexts/AuthUserContext';
import { useRouter } from 'next/router';



const Dashboard: NextPage = () => {
  const { loading: loadingAuth } = useAuth()
  return (
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
      >
        {loadingAuth && <Spinner />}
      </Flex>
    
  )
}

export default Dashboard;
