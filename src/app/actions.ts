"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createParty(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    throw new Error("Party name is required");
  }

  const party = await prisma.party.create({
    data: {
      name: name.trim(),
    },
  });

  revalidatePath("/");
  return { success: true, partyId: party.id };
}
