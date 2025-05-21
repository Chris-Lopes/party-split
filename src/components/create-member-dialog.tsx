"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addMember } from "@/app/party/[id]/actions";
import { Spinner } from "@/components/ui/spinner";

export function CreateMemberDialog({ partyId }: { partyId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [credits, setCredits] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", memberName);
      formData.append("credits", credits);
      formData.append("partyId", partyId);

      const result = await addMember(formData);
      if (result.success) {
        setIsOpen(false);
        setMemberName("");
        setCredits("");
        // Refresh the page to show new member
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Member Name
            </label>
            <input
              type="text"
              id="name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter member name..."
              required
            />
          </div>
          <div>
            <label htmlFor="credits" className="block text-sm font-medium mb-2">
              Initial Credits
            </label>
            <input
              type="number"
              id="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter initial credits..."
              step="0.01"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Adding...
              </>
            ) : (
              "Add Member"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
