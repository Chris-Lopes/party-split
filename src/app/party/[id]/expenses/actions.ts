"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

export async function addExpense(formData: FormData) {
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const partyId = formData.get("partyId") as string;
  const memberIds = (formData.get("memberIds") as string).split(",");

  if (!description || !amount || !partyId || memberIds.length === 0) {
    throw new Error("All fields are required");
  }

  // Get the first member as the expense creator (we could make this more sophisticated later)
  const createdById = memberIds[0];

  // Calculate share per member
  const sharePerMember = amount / memberIds.length;

  // Create the expense and all participant records in a transaction
  const expense = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // Create the expense
      const expense = await tx.expense.create({
        data: {
          description: description.trim(),
          amount,
          partyId,
          createdById,
          participants: {
            create: memberIds.map((memberId) => ({
              memberId,
              share: sharePerMember,
            })),
          },
        },
      });

      // Update credits for all participating members - do this in parallel for better performance
      await Promise.all(
        memberIds.map((memberId) =>
          tx.member.update({
            where: { id: memberId },
            data: {
              credits: {
                decrement: sharePerMember,
              },
            },
          })
        )
      );

      return expense;
    }
  );

  revalidatePath(`/party/${partyId}/expenses`);
  return { success: true, expenseId: expense.id };
}
