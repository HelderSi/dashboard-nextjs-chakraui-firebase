import {
  Icon,
  Link as ChakraLink,
  Text,
  LinkProps as ChakraLinkProps,
  useColorModeValue,
  Button
} from "@chakra-ui/react";
import { ElementType } from "react";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children: string;
  href: string;
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps) {
  const hoverColor = useColorModeValue('gray.50', 'gray.600')
  return (
    <ActiveLink href={href} passHref >
      <ChakraLink 
        display="flex" 
        alignItems="center" 
        _hover={{bgColor: hoverColor}}
        py={"4"}
        pl={"2"}
        pr={"8"}
        rounded={"md"}
        {...rest}
      >
        <Icon as={icon} fontSize="20"  />
        <Text ml="4" fontWeight="500">{children}</Text>
      </ChakraLink>
    </ActiveLink>
  );
}