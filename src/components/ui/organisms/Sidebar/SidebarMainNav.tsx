import { Stack } from "@chakra-ui/react";
import {
  RiToolsFill,
  RiDashboardLine,
  RiHeart2Line
} from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarMainNav() {
  return (
    <Stack spacing="8" aling="flex-start">
      <NavSection title="PRINCIPAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
        <NavLink icon={RiHeart2Line} href="/favorites">Favoritos</NavLink>
      </NavSection>

      <NavSection title="CONFIGURAÇÕES">
        <NavLink icon={RiToolsFill} href="/settings">Geral</NavLink>
      </NavSection>
    </Stack>
  );
}