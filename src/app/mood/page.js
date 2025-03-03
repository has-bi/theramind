import { EmojiForm } from "./moodCreate";

export default function pages() {
  return (
    <div className="min-h-screen bg-slate-100">
      <title>Daily Mood Tracker</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />

      <main className="container mx-auto py-8">
        <EmojiForm />
      </main>
    </div>
  );
}
