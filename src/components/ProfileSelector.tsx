
"use client";

import * as React from "react";
import { Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSelector() {
  const [open, setOpen] = React.useState(false);
  const [showNewProfileDialog, setShowNewProfileDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [newProfileName, setNewProfileName] = React.useState("");
  const [profileToDelete, setProfileToDelete] = React.useState<string | null>(null);
  const [tempSelectedProfile, setTempSelectedProfile] = React.useState<string | null>(null);
  const router = useRouter();


  const {
    profiles,
    setCurrentProfile,
    addProfile,
    deleteProfile,
    currentProfile,
  } = useProfile();
  const { toast } = useToast();

  React.useEffect(() => {
    if(currentProfile) {
      setTempSelectedProfile(currentProfile.username);
    }
  }, [currentProfile, open]);

  const handleCreateProfile = async () => {
    if (newProfileName.trim() && !profiles[newProfileName.trim()]) {
      const success = await addProfile(newProfileName.trim());
      if (success) {
        setNewProfileName("");
        setShowNewProfileDialog(false);
        setTempSelectedProfile(newProfileName.trim());
      }
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Name",
            description: "Profile name cannot be empty or already exist."
        })
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, username: string) => {
    e.stopPropagation();
    setProfileToDelete(username);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if(profileToDelete) {
        deleteProfile(profileToDelete);
        if (tempSelectedProfile === profileToDelete) {
          setTempSelectedProfile(null);
        }
        setProfileToDelete(null);
        setShowDeleteDialog(false);
    }
  }

  const profileList = Object.values(profiles);
  
  const handleStart = () => {
    if (tempSelectedProfile) {
      setCurrentProfile(tempSelectedProfile);
      setOpen(false);
      router.push('/practice');
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
             <Button variant="outline" size="lg" className="w-64 shadow-subtle">
                Play from Existing Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Profile</DialogTitle>
              <DialogDescription>
                Choose your profile to continue your progress.
              </DialogDescription>
            </DialogHeader>
            <Command>
              <CommandInput placeholder="Search profiles..." />
              <CommandList>
                <CommandEmpty>No profile found. Create one to get started!</CommandEmpty>
                <CommandGroup>
                  {profileList.map((profile) => (
                    <CommandItem
                      key={profile.username}
                      value={profile.username}
                      onSelect={() => {
                         setTempSelectedProfile(profile.username);
                      }}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center flex-grow">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tempSelectedProfile === profile.username
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {profile.username}
                      </div>
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleDeleteClick(e, profile.username)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                       </Button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <DialogFooter>
               <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={!tempSelectedProfile} onClick={handleStart}>
                Let's Begin!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button size="lg" className="w-64 shadow-subtle" onClick={() => setShowNewProfileDialog(true)}>
            Create New Profile
        </Button>
      </div>


      {/* New Profile Dialog */}
       <AlertDialog open={showNewProfileDialog} onOpenChange={setShowNewProfileDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create a New Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a username for your new profile. This will be stored locally on your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            id="new-profile-name"
            name="new-profile-name"
            placeholder="Username"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowNewProfileDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateProfile}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              profile <span className="font-bold text-primary">{profileToDelete}</span> and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProfileToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
