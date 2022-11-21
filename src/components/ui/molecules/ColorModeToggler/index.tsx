import { useColorMode, Icon, Switch, HStack } from '@chakra-ui/react'
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
        _hover={{color: "gray.200"}}
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
        _hover={{color: "gray.500"}}
      />
    </HStack>
  )
}

export default ColorModeToggler;
