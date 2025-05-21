"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addMember(formData: FormData) {
  const name = formData.get("name") as string;
  const credits = parseFloat(formData.get("credits") as string);
  const partyId = formData.get("partyId") as string;

  if (!name || !credits || !partyId) {
    throw new Error("Name, credits, and partyId are required");
  }

  const member = await prisma.member.create({
    data: {
      name: name.trim(),
      credits,
      partyId,
    },
  });

  revalidatePath(`/party/${partyId}`);
  return { success: true, memberId: member.id };
}

export async function updateMemberCredits(formData: FormData) {
  const memberId = formData.get("memberId") as string;
  const credits = parseFloat(formData.get("credits") as string);
  const partyId = formData.get("partyId") as string;

  if (!memberId || isNaN(credits)) {
    throw new Error("Member ID and credits are required");
  }

  const member = await prisma.member.update({
    where: { id: memberId },
    data: { credits },
  });

  revalidatePath(`/party/${partyId}`);
  return { success: true };
}
