import { ColorModeScript } from "@chakra-ui/react"
import Document, { Head, Html, Main, NextScript } from 'next/document';
import theme from "src/styles/theme";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode}  />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}