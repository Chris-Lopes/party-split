import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  // Limit to the most recent parties for better build performance
  const parties = await prisma.party.findMany({
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: 10, // Only pre-generate the 10 most recent parties
  });

  return parties.map((party) => ({
    id: party.id,
  }));
}
