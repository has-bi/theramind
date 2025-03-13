import { EmojiForm } from "./moodCreate";
import { Metadata } from "next";

export const metadata = {
  title: "Theramind - Mood Check-in",
  description: "Select how you're feeling today",
};

export default function Page() {
  return <EmojiForm />;
}
