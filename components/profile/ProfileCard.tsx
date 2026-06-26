"use client";
import { Profile } from "@/types/types";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Pencil } from "lucide-react";

interface Props {
  profile: Profile;
  onEdit: () => void;
}

function ProfileCard({ profile, onEdit }: Props) {
  return (
    <button
      onClick={onEdit}
      className="group flex cursor-pointer flex-col items-center gap-3"
    >
      <div className="relative h-32 w-32 overflow-hidden rounded-sm">
        <Image
          src={profile.avatar ?? "/images/netflix--avatar.png"}
          alt={profile.name}
          fill
          className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-40"
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
            <Pencil size={20} className="text-white" />
          </div>
        </div>
      </div>

      <span className="text-sm text-white/70 transition-colors group-hover:text-white">
        {profile.name}
      </span>
      {profile.isKids && (
        <span className="-mt-1.5 text-[10px] font-bold tracking-wide text-blue-400">
          KIDS
        </span>
      )}
    </button>
  );
}

export default ProfileCard;
