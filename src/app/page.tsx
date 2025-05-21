import { CreatePartyDialog } from "@/components/create-party-dialog";
import { prisma } from "@/lib/db";
import { delay } from "@/lib/delay";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define the type for parties that includes the _count field
type PartyWithMemberCount = {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    members: number;
  };
};

async function getParties(): Promise<PartyWithMemberCount[]> {
  const parties = await prisma.party.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
  return parties;
}

export default async function Home() {
  const parties = await getParties();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Party Split</h1>
          <CreatePartyDialog />
        </div>

        <div className="grid gap-4">
          {parties.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No parties created yet. Create your first party to get started!
            </div>
          ) : (
            parties.map((party) => (
              <Link key={party.id} href={`/party/${party.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle>{party.name}</CardTitle>
                    <CardDescription>
                      {party._count.members} member
                      {party._count.members === 1 ? "" : "s"} • Created{" "}
                      {new Date(party.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
