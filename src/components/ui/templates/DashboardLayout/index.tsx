import { useEffect, ReactNode } from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { Header } from "src/components/ui/organisms/Header";
import { Sidebar } from "src/components/ui/organisms/Sidebar";
import { useAuth } from "src/contexts/AuthUserContext";
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
  const { authUser } = useAuth()
  const { asPath, push } = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.800')

  useEffect(() => {
    if (!authUser && !PUBLIC_ROUTES.includes(asPath)) push('/signin')
  }, [asPath, authUser, push])

  if (PUBLIC_ROUTES.includes(asPath)) return <>{children}</>
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
