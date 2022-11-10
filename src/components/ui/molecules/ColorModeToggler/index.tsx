import { useColorMode, Icon, Switch, HStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button';
import { RiSunFill, RiMoonLine } from "react-icons/ri";

const ColorModeToggler = () => {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode()
  const isDark = colorMode === "dark"


 
  return (
    <HStack justify="center">
      <Icon 
        onClick={() => setColorMode("light")} 
        as={RiSunFill} 
        color={ isDark ? "gray.400" : undefined}
      />
      <Switch 
        colorScheme='gray' 
        size='lg'
        defaultChecked={isDark}
        isChecked={isDark}
        onChange={toggleColorMode} 
      />
      <Icon 
        onClick={() => setColorMode("dark")} 
        as={RiMoonLine} 
        color={ !isDark ? "gray.300" : undefined}
      />
    </HStack>
  )
}

export default ColorModeToggler;
