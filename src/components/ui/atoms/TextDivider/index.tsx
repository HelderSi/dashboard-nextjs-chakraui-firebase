import { HStack, Heading } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";

interface TextDividerProps {
    text: string
}

export function TextDivider(props: TextDividerProps) {
    return (
        <HStack pv={8}>
            <Divider />
            <Heading size="sm">
                {props.text}
            </Heading>
            <Divider />
        </HStack>
    );
}





