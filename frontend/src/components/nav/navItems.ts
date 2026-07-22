import type { SVGProps } from "react";
import { HomeIcon, ExploreIcon, PlusIcon, TasksIcon, UserIcon } from "@/components/ui/icons";

export interface NavItem {
  key: string;
  labelKey: "home" | "explore" | "create" | "myBounties" | "profile";
  href: string;
  icon: (p: SVGProps<SVGSVGElement>) => JSX.Element;
  primary?: boolean;
}

/** Primary navigation destinations, shared by mobile and desktop nav. Labels
 *  are translation keys under `nav.*` (see lib/i18n) - resolve with useT(). */
export const NAV_ITEMS: NavItem[] = [
  { key: "home", labelKey: "home", href: "/", icon: HomeIcon },
  { key: "explore", labelKey: "explore", href: "/bounties", icon: ExploreIcon },
  { key: "create", labelKey: "create", href: "/create", icon: PlusIcon, primary: true },
  { key: "mine", labelKey: "myBounties", href: "/my", icon: TasksIcon },
  { key: "profile", labelKey: "profile", href: "/account", icon: UserIcon },
];

/** Whether a nav href is active for the given pathname. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
