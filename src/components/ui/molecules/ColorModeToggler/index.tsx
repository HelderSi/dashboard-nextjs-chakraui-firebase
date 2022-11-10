import { useColorMode, Icon } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button';
import { RiSunFill, RiMoonLine } from "react-icons/ri";

const ColorModeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode()
 
  return (
    <Button maxW={50} onClick={toggleColorMode}><Icon as={ colorMode === "light"  ? RiMoonLine : RiSunFill } /></Button>
  )
}

export default ColorModeToggler;
