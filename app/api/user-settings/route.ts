import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "BDT",
      },
    });
  }

  revalidatePath("/");
  //   return Response.json(userSettings);

  return new Response(JSON.stringify(userSettings), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
