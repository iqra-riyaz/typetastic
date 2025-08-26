"use client";

import * as React from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";

export function ProfileSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { profiles, currentProfile, setCurrentProfile, loading } = useProfile();

  const profileList = Object.values(profiles);

  const handleSelectProfile = (username: string) => {
    setCurrentProfile(username);
    setOpen(false);
  };

  if (loading) {
    return <Button variant="outline" className="w-full justify-start" disabled>Loading...</Button>;
  }

  if (!currentProfile) {
    return <Button variant="outline" className="w-full justify-start" disabled>No Profile</Button>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-sm"
        >
          <User className="mr-2 h-4 w-4" />
          <span className="truncate">{currentProfile.username}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {profileList.length === 0 ? (
                <CommandEmpty>No profiles found.</CommandEmpty>
              ) : (
                profileList.map((profile) => (
                  <CommandItem
                    key={profile.username}
                    value={profile.username}
                    onSelect={() => handleSelectProfile(profile.username)}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center flex-grow truncate">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentProfile?.username === profile.username
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="truncate">{profile.username}</span>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

