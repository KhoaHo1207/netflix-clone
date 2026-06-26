"use client";
import React, { useState } from "react";
import useCreateProfile from "@/hooks/profile/useCreateProfile";
import useDeleteProfile from "@/hooks/profile/useDeleteProfile";
import useUpdateProfile from "@/hooks/profile/useUpdateProfile";
import { Profile } from "@/types/types";
import { useProfileContext } from "@/context/profileContext";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  profile: Profile | null;
  onDone: () => void;
}

function ProfileForm({ profile, onDone }: Props) {
  const { activeProfile, setActiveProfile } = useProfileContext();

  const { mutate: createProfile, isPending: creating } = useCreateProfile();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();
  const { mutate: deleteProfile, isPending: deleting } = useDeleteProfile();

  const isNew = profile === null;

  const [name, setName] = useState(profile?.name ?? "");
  const [isKids, setIsKids] = useState(profile?.isKids ?? false);

  const isPending = creating || updating || deleting;

  const handleSave = () => {
    const trimmed = name.trim();
    if (isNew) {
      createProfile({ name: trimmed, isKids }, { onSuccess: onDone });
    } else {
      updateProfile(
        {
          id: profile.id,
          name: trimmed,
          isKids,
        },
        {
          onSuccess: (updated) => {
            if (activeProfile?.id === updated.id) {
              setActiveProfile(updated);
            }
            onDone();
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!profile) return;
    deleteProfile(profile.id, { onSuccess: onDone });
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <h1 className="w-full border-b border-white/20 pb-5 text-3xl font-medium text-white">
        {isNew ? "Add Profile" : "Edit Profile"}
      </h1>

      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-sm">
        <Image
          src={profile?.avatar ?? "/images/netflix--avatar.png"}
          alt="Profile avatar"
          className="h-full w-full object-cover"
          width={112}
          height={112}
        />
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Profile Name"
          className="h-10 w-full rounded-sm bg-zinc-600 px-3 text-sm text-white placeholder:text-white/30 focus:ring-1 focus:ring-white/40 focus:outline-none"
        />
      </div>

      <div className="flex w-full items-start gap-3 rounded-sm bg-zinc-800 p-3">
        <Input
          type="checkbox"
          id="kids-toggle"
          checked={isKids}
          onChange={(e) => setIsKids(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#E50914]"
        />

        <div>
          <Label htmlFor="kids-toggle">Kids</Label>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            Only see TV shows and movies rated for ages 12 and under.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="h-10 rounded-sm bg-white text-sm font-semibold text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating || updating ? "Saving…" : "Save"}
        </Button>

        <Button
          onClick={onDone}
          disabled={isPending}
          className="h-10 rounded-sm border border-white/40 text-sm font-semibold text-white/70 transition-colors hover:border-white hover:text-white disabled:opacity-50"
        >
          Cancel
        </Button>

        {!isNew && (
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 rounded-sm border border-white/30 text-sm font-semibold text-white/50 transition-colors hover:border-red-500 hover:text-red-500 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete Profile"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProfileForm;
