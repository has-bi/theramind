import { format, addDays, startOfWeek, endOfWeek, getDate } from "date-fns";
import { UserIcon, BellIcon, HomeIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { prisma } from "@/utils/prisma";

export default async function ProfilePage() {
  const users = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const emotions = await prisma.emotion.findUnique({
    where: {
      id,
    },
  });

  const moods = await prisma.moodEntry.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
        lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
    },
    include: {
      emotion: true,
    },
  });

  // Hitung Mood Statistik
  const moodStats = moods.reduce((acc, mood) => {
    acc[mood.emotion.name] = (acc[mood.emotion.name] || 0) + 1;
    return acc;
  }, {});

  // Generate Kalender Mood Streak
  const moodWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek, i);
    const mood = moods.find(m => format(m.createdAt, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    return {
      day: format(date, "EEE"),
      date: format(date, "MMM d"),
      mood: mood?.emotion?.name ?? "",
    };
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Profile Section */}
      <div className="bg-white p-6 text-center shadow-md">
        <UserCircleIcon className="h-20 w-20 mx-auto text-gray-500" />
        <h2 className="text-lg font-semibold mt-2 text-black">
          {users.firstName} {users.lastName}
        </h2>
        <p className="text-gray-500 text-sm">@{users.email}</p>
        <button className="mt-3 ml-80 w-6 h-6 text-black">
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mood Card */}
      <div className="bg-white p-4 rounded-lg shadow-md mx-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mood Streak</h3>
        <div className="grid grid-cols-7 gap-2">
          {moodWeek.map((day, index) => (
            <div key={index} className="text-center p-2 border rounded-lg bg-gray-100">
              <p className="text-sm text-gray-500">{day.day}</p>
              <p className="text-xs text-gray-500">{day.date}</p>
              <p className="text-xs font-semibold text-gray-700">{day.mood}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-md mx-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mood Statistics</h3>
        <div className="flex justify-between">
          {Object.entries(moodStats).map(([mood, count], index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-500">{mood}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white shadow-lg fixed bottom-0 w-full flex justify-around py-3">
        <NavItem title="Home" Icon={HomeIcon} />
        <NavItem title="Notification" Icon={BellIcon} />
        <NavItem title="My Profile" Icon={UserIcon} />
      </div>
    </div>
  );
}

// Komponen untuk Bottom Navigation
const NavItem = ({ title, Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center ${active ? "text-indigo-500" : "text-gray-400"}`}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs mt-1">{title}</span>
  </button>
);
