export default function getMoodColor(mood) {
  const moodLower = mood.toLowerCase();

  const colors = {
    all: { bg: "bg-gray-500", text: "text-white" },
    happy: { bg: "bg-mood-happy", text: "text-white" },
    sad: { bg: "bg-mood-sad", text: "text-white" },
    calm: { bg: "bg-mood-calm", text: "text-white" },
    angry: { bg: "bg-mood-angry", text: "text-white" },
    anxious: { bg: "bg-mood-anxious", text: "text-white" },
    neutral: { bg: "bg-mood-neutral", text: "text-gray-700" },
    stressed: { bg: "bg-mood-stressed", text: "text-white" },
    excited: { bg: "bg-mood-excited", text: "text-gray-700" },
    tired: { bg: "bg-mood-tired", text: "text-blue-800" },
    confused: { bg: "bg-mood-confused", text: "text-white" },
    grateful: { bg: "bg-mood-grateful", text: "text-cyan-800" },
    loved: { bg: "bg-mood-loved", text: "text-white" },
    default: { bg: "bg-gray-100", text: "text-gray-700" },
  };

  return colors[moodLower] || colors.default;
}
