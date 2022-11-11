import { ElementType } from "react";
import Link, { LinkProps } from "next/link";
import { Box, Icon, Text, useColorModeValue } from "@chakra-ui/react";

import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  shouldMatchExactHref?: boolean;
  icon: ElementType;
  title: string;
}

export function NavButton({
  shouldMatchExactHref = false,
  icon,
  title,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  const inactiveLinkColor = useColorModeValue('gray.300', 'gray.50')
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const hoverColor = useColorModeValue('gray.50', 'gray.600')

  let isActive = false;

  if (shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true;
  }

  if (!shouldMatchExactHref && (
    asPath.startsWith(String(rest.href)) ||
    asPath.startsWith(String(rest.as))
  )) {
    isActive = true;
  }

  return (
    <Link {...rest}>
      <Box
        display="flex" 
        alignItems="center" 
        _hover={{bgColor: hoverColor}}
        py={"4"}
        pl={"2"}
        pr={"8"}
        rounded={"md"}
        color={isActive ? 'red.400' : inactiveLinkColor}
        bgColor={isActive ? bgColor : undefined}
      >
        <Icon as={icon} fontSize="20"  />
        <Text ml="4" fontWeight="500">{title}</Text>
      </Box>
    </Link>
  );
}