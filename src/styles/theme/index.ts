import { extendTheme } from "@chakra-ui/react";

import styles from "./styles";
import palette from "./foundations/palette";
import typography from "./foundations/typography";

export default extendTheme({
  colors: palette,
  fonts: typography,
  styles,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});
