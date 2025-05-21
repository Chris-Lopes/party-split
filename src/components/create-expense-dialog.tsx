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
import { addExpense } from "@/app/party/[id]/expenses/actions";
import { Member } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

export function CreateExpenseDialog({
  partyId,
  members,
}: {
  partyId: string;
  members: Member[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectAllMembers = () => {
    const allMemberIds = members.map((member) => member.id);
    setSelectedMembers(new Set(allMemberIds));
  };

  const unselectAllMembers = () => {
    setSelectedMembers(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("amount", amount);
      formData.append("partyId", partyId);
      formData.append("memberIds", Array.from(selectedMembers).join(","));

      const result = await addExpense(formData);
      if (result.success) {
        setIsOpen(false);
        setDescription("");
        setAmount("");
        setSelectedMembers(new Set());
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (memberId: string) => {
    const newSet = new Set(selectedMembers);
    if (newSet.has(memberId)) {
      newSet.delete(memberId);
    } else {
      newSet.add(memberId);
    }
    setSelectedMembers(newSet);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter expense description..."
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter amount..."
              step="0.01"
              required
            />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium">
                  Split Between
                </label>
                {members.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {selectedMembers.size} of {members.length} selected
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllMembers}
                  className="text-xs"
                >
                  Select All
                </Button>
                {selectedMembers.size > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={unselectAllMembers}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto pr-1 border rounded-md p-2">
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={selectedMembers.size === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Adding...
              </>
            ) : (
              "Add Expense"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
