import { useEffect, ReactNode } from "react";
import { Center, Flex } from "@chakra-ui/react";
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

  useEffect(() => {
    if (!authUser && !PUBLIC_ROUTES.includes(asPath)) push('/signin')
  }, [asPath, authUser, push])

  if (PUBLIC_ROUTES.includes(asPath)) return <>{children}</>
  return (
    <Flex direction="row" maxWidth={1480}>
      <Sidebar />
      <Flex direction="column" w="full">
        <Header />
        <Center w="full">
          {children}
        </Center>
      </Flex>
    </Flex>
  );
}
