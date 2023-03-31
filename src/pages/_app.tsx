import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from 'next/app'
import theme from "styles/theme";
import { AuthUserProvider } from 'contexts/AuthUserContext'
import { SidebarDrawerProvider } from "contexts/SidebarDrawerContext";
import DashboardLayout from "components/ui/templates/DashboardLayout";
import { useRouter } from "next/router";

const PUBLIC_ROUTES = [
  '/signin',
  '/signup',
  '/forgot-pw'
]

function MyApp({ Component, pageProps }: AppProps) {
  const { route } = useRouter()

  return <ChakraProvider theme={theme}>
    <AuthUserProvider>
      <SidebarDrawerProvider>
        {
          PUBLIC_ROUTES.includes(route) ?
            <Component {...pageProps} />
            : <DashboardLayout>
              <Component {...pageProps} />
            </DashboardLayout>
        }
      </SidebarDrawerProvider>
    </AuthUserProvider>
  </ChakraProvider>
}

export default MyApp
