import CalendarMoodView from "./calendarMoodView";

export default async function Page() {
  return (
    <div>
      Temporary (protected) Dashboard Page
      <header className="font-bold text-3xl text-center">Dashboard</header>
      <main>
        <CalendarMoodView />
      </main>
    </div>
  );
}
