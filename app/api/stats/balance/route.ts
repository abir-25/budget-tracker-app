import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBandSizeOfAxis } from "recharts/types/util/ChartUtils";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error.message), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });
  console.log({ totals });
  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}
