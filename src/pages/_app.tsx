import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from 'next/app'
import theme from "src/styles/theme";
import {AuthUserProvider} from 'src/contexts/AuthUserContext'
import { SidebarDrawerProvider } from "src/contexts/SidebarDrawerContext";
import DashboardLayout from "src/components/ui/templates/DashboardLayout";

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
