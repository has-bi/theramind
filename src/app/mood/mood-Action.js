"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMoodAction(_, formData) {
  // const userId = formData.get("userId");
  const emotionId = Number(formData.get("emotionId"));

  //   revalidatePath("/");
  console.log(emotionId);
  redirect("/journal");
}
