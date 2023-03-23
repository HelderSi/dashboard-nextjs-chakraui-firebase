import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from 'next/app'
import theme from "styles/theme";
import { AuthUserProvider } from 'contexts/AuthUserContext'
import { SidebarDrawerProvider } from "contexts/SidebarDrawerContext";
import DashboardLayout from "components/ui/templates/DashboardLayout";
import styles from 'styles/custom/firebaseui-custom.css';


function MyApp({ Component, pageProps }: AppProps) {

  return <ChakraProvider theme={theme}>
    <AuthUserProvider>
      <SidebarDrawerProvider>
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      </SidebarDrawerProvider>
    </AuthUserProvider>
  </ChakraProvider>
}

export default MyApp
