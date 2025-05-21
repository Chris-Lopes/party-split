import { prisma } from "@/lib/db";
import { delay } from "@/lib/delay";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CreateMemberDialog } from "@/components/create-member-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getParty(id: string) {
  const party = await prisma.party.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { expenses: true },
      },
    },
  });

  if (!party) notFound();
  return party;
}

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: any) {
  const resolvedParams = await Promise.resolve(params);
  const party = await getParty(resolvedParams.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">{party.name}</h1>
            <p className="text-sm text-muted-foreground">
              {party._count.expenses} expense
              {party._count.expenses === 1 ? "" : "s"} • Created{" "}
              {new Date(party.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/party/${party.id}/expenses`}>Expenses</Link>
            </Button>
            <div className="w-full sm:w-auto">
              <CreateMemberDialog partyId={party.id} />
            </div>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="divide-y dark:divide-gray-800">
              {party.members.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No members yet. Add members to start tracking expenses!
                </div>
              ) : (
                party.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 sm:py-4 gap-3 sm:gap-2"
                  >
                    <div className="space-y-2 sm:space-y-1">
                      <div className="font-medium text-base sm:text-sm">
                        {member.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={`font-mono text-xl sm:text-lg font-semibold ${
                        member.credits >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      ₹{member.credits.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
