import type { SVGProps } from "react";
import { HomeIcon, ExploreIcon, PlusIcon, TasksIcon, UserIcon } from "@/components/ui/icons";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: (p: SVGProps<SVGSVGElement>) => JSX.Element;
  primary?: boolean;
}

/** Primary navigation destinations, shared by mobile and desktop nav. */
export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", href: "/", icon: HomeIcon },
  { key: "explore", label: "Explore", href: "/bounties", icon: ExploreIcon },
  { key: "create", label: "Create", href: "/create", icon: PlusIcon, primary: true },
  { key: "mine", label: "My Bounties", href: "/my", icon: TasksIcon },
  { key: "profile", label: "Profile", href: "/account", icon: UserIcon },
];

/** Whether a nav href is active for the given pathname. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
