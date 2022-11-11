import { Stack } from "@chakra-ui/react";
import {
  RiToolsFill,
  RiDashboardLine,
  RiHeart2Line
} from "react-icons/ri";
import { NavButton } from "./NavButton";
import { NavSection } from "./NavSection";

export function SidebarMainNav() {
  return (
    <Stack spacing="8">
      <NavSection title="PRINCIPAL">
        <NavButton icon={RiDashboardLine} title="Dashboard" href="/dashboard" />
        <NavButton icon={RiHeart2Line} title="Favoritos" href="/favorites" />
      </NavSection>
      <NavSection title="CONFIGURAÇÕES">
        <NavButton icon={RiToolsFill} title="Geral" href="/settings" />
      </NavSection>
    </Stack>
  );
}