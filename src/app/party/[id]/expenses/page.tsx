import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { CreateExpenseDialog } from "@/components/create-expense-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPartyWithExpenses(id: string) {
  const party = await prisma.party.findUnique({
    where: { id },
    include: {
      members: true,
      expenses: {
        include: {
          createdBy: true,
          participants: {
            include: {
              member: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!party) notFound();
  return party;
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExpensesPage({ params }: Props) {
  const party = await getPartyWithExpenses(params.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              <Link href={`/party/${party.id}`} className="hover:underline">
                {party.name}
              </Link>
              {" › Expenses"}
            </h1>
          </div>
          <CreateExpenseDialog partyId={party.id} members={party.members} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y dark:divide-gray-800">
              {party.expenses.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No expenses yet. Add an expense to start tracking!
                </div>
              ) : (
                party.expenses.map((expense) => (
                  <div key={expense.id} className="py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                      <div className="space-y-1">
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Added by {expense.createdBy.name} •{" "}
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-mono font-medium text-lg">
                        {expense.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground break-words">
                      Split between:{" "}
                      {expense.participants
                        .map((p) => p.member.name)
                        .join(", ")}
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
