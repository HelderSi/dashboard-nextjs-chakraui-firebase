import { Text } from "@chakra-ui/react";

export default function DashboardLogo() {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
      p={["4", "8"]}
    >
      NextDash
      <Text as='span' ml="1" color="red.500">.</Text>
    </Text>
  );
}