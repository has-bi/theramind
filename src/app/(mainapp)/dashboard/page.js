import CalendarMoodView from "./calendarMoodView";

export default async function Page() {
  // i am deleting duplicated files and folders
  // add this to make the commit works because
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
