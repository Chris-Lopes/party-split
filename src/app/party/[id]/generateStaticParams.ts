import { prisma } from "@/lib/db";

export async function generateStaticParams() {
  const parties = await prisma.party.findMany({
    select: { id: true },
  });

  return parties.map((party) => ({
    id: party.id,
  }));
}
