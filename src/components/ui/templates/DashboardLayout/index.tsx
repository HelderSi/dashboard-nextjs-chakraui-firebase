import { useEffect, ReactNode } from "react";
import { Center, Flex, Spinner, useColorModeValue } from "@chakra-ui/react";
import { Header } from "components/ui/organisms/Header";
import { Sidebar } from "components/ui/organisms/Sidebar";
import { useAuth } from "../../../../contexts/AuthUserContext";
import { useRouter } from "next/router";

interface Props {
  children: ReactNode;
}

const PUBLIC_ROUTES = [
  '/signin',
  '/signup',
  '/forgot-pw'
]

export default function DashboardLayout({ children }: Props) {
  const { authUser, loading: loadingAuth, isSignInWithEmailLink, signInWithEmailLink } = useAuth()
  const { push, query, route } = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.800')
  console.log(route)
  console.log(authUser)
  console.log(query)


  useEffect(() => {
    if (!loadingAuth && !authUser && !PUBLIC_ROUTES.includes(route)) push(`/signin`)
    if (!authUser && isSignInWithEmailLink()) {
      signInWithEmailLink()
    }
  }, [loadingAuth, route, authUser, push, isSignInWithEmailLink, signInWithEmailLink])

  if (loadingAuth)
    return <Center h="100vh">
      <Spinner size='lg' />
    </Center>

  if (PUBLIC_ROUTES.includes(route)) return <>{children}</>
  if (!authUser)
    return <Center h="100vh">
      <Spinner size='lg' />
    </Center>
  return (
    <Flex direction="row">
      <Sidebar />
      <Flex direction="column" w="full">
        <Header />
        <Flex
          bgColor={bg}
          minH={"100vh"}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
