"use client";
import { useProfileContext } from "@/context/profileContext";
import useFetchProfiles from "@/hooks/profile/useFetchProfiles";
import useIsAdmin from "@/hooks/useIsAdmin";
import { ChevronDown, LogOut, Settings, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { myListQueryKey } from "@/hooks/my-list/useFetchMyList";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Films", href: "/movies" },
  { label: "New & Popular", href: "/new-popular" },
  { label: "My List", href: "/my-list" },
];

function Header() {
  const pathname = usePathname();
  const { activeProfile, setActiveProfile, activeProfileId } =
    useProfileContext();
  const { data: profiles = [] } = useFetchProfiles();
  const queryClient = useQueryClient();

  const supabase = createClient();
  const router = useRouter();

  const isAdmin = useIsAdmin();

  // auto select first profile if there is only one and no active profile
  useEffect(() => {
    if (profiles.length === 0) return;
    if (activeProfile) return;

    const stored = profiles.find((p) => p.id === activeProfileId);
    setActiveProfile(stored ?? profiles[0]);
  }, [profiles, activeProfile, activeProfileId, setActiveProfile]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileSwitch = (profile: (typeof profiles)[number]) => {
    setActiveProfile(profile);
    queryClient.invalidateQueries({
      queryKey: myListQueryKey(profile.id),
    });
  };

  return (
    <header className="sticky top-0 z-50 flex min-h-17.5 w-full items-center justify-between bg-linear-to-b from-black to-transparent px-4 sm:px-6 md:px-14">
      <div className="flex items-center gap-6">
        <Link href={"/"} className="text-2xl font-bold text-red-600">
          <Image
            src={"/logo--netflix.svg"}
            alt="Netflix Logo"
            width={100}
            height={64}
            className="w-20 md:w-25"
          />
        </Link>

        <ul className="hidden space-x-4 md:flex">
          {menuItems.map((li) => {
            return (
              <li key={li.label}>
                <Link
                  href={li.href}
                  className={`text-sm ${pathname === li.href ? "font-semibold text-white" : "text-white/70 transition-colors hover:text-white/90"}`}
                >
                  {li.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            href={"/admin"}
            className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ShieldCheck size={16} />
            Admin
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-1.5 outline-none">
              <Image
                src={activeProfile?.avatar ?? "/images/netflix--avatar.png"}
                alt={activeProfile?.name ?? "Profile"}
                width={40}
                height={40}
                className="h-8 w-8 shrink-0 rounded-sm object-cover sm:h-10 sm:w-10"
              />
              <ChevronDown
                size={16}
                className="text-white/70 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 rounded-sm border border-white/15 bg-black/95 p-1 text-white"
          >
            {profiles.map((profile) => {
              const isActive = activeProfile?.id === profile.id;
              return (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => handleProfileSwitch(profile)}
                  className="flex cursor-pointer items-center gap-3 rounded-sm bg-transparent px-3 py-2 text-white hover:bg-transparent hover:underline focus:bg-transparent focus:text-white focus:**:text-white!"
                >
                  <Image
                    src={profile.avatar ?? "/images/netflix--avatar.png"}
                    alt={profile.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-sm object-cover"
                  />

                  <div className="flex min-w-0 flex-col">
                    <span
                      className={`truncate text-sm ${isActive ? "font-semibold text-white hover:text-white" : "text-white/80"}`}
                    >
                      {profile.name}
                    </span>
                    {profile.isKids && (
                      <span className="text-[10px] font-bold tracking-wide text-blue-400">
                        KIDS
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="my-1 bg-white/10" />

            <DropdownMenuItem
              asChild
              className="flex cursor-pointer items-center gap-3 rounded-sm bg-transparent px-3 py-2 text-white hover:bg-transparent hover:underline focus:bg-transparent focus:text-white focus:**:text-white!"
            >
              <Link href="/manage-profiles">
                <Settings size={22} className="shrink-0 text-white/60" />
                <span className="text-sm text-white/80">Manage Profiles</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-white/10" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex cursor-pointer items-center gap-3 rounded-sm bg-transparent px-3 py-2 text-white hover:bg-transparent hover:underline focus:bg-transparent focus:text-white focus:**:text-white!"
            >
              <LogOut size={22} className="shrink-0 text-white/60" />
              <span className="text-sm text-white/80">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
