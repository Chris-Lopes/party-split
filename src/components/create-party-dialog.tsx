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
import { createParty } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";

export function CreatePartyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", partyName);

      const result = await createParty(formData);
      if (result.success) {
        setIsOpen(false);
        window.location.href = `/party/${result.partyId}`;
      }
    } catch (error) {
      console.error("Failed to create party:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Party</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Party</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Party Name
            </label>
            <input
              type="text"
              id="name"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter party name..."
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Creating...
              </>
            ) : (
              "Create Party"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
