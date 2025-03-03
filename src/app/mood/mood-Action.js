"use server";

import { revalidatePath } from "next/cache";

export async function createMoodAction(_, formData) {
  // const userId = formData.get("title");
  const emotionId = Number(formData.get("emoticon"));
  //   const category = formData.get("category");

  //   await fetch("https://v1.appbackend.io/v1/rows/Ue6Yyc5VevV4", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify([{ title, amount, category }]),
  //   });

  //   revalidatePath("/");
  console.log(emotionId);
}
