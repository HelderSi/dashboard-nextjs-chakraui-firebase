import type { NextPage } from 'next'
import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react'
import { useAuth } from 'contexts/AuthUserContext';

const Dashboard: NextPage = () => {
  const { loading: loadingAuth } = useAuth()
  return (
    <Flex
      align="center"
      justify="center"
    >
      {loadingAuth && <Spinner />}
    </Flex>

  )
}

export default Dashboard;
