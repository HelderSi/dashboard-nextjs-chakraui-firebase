import { Stack } from "@chakra-ui/react";
import {
  RiToolsFill,
  RiDashboardLine,
  RiStore2Line,
  RiHeart2Line
} from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" aling="flex-start">
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