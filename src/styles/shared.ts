
import { type ClassValue } from "clsx";

export const commonStyles = {
  container: "min-h-screen flex flex-col relative",
  card: "border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850 overflow-hidden",
  cardContent: "p-4",
  gradientBg: "bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950",
  textGradient: "bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  heading: "text-2xl font-bold text-purple-300",
  subheading: "text-purple-300/80 text-sm mt-1",
  button: {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white transition-colors",
    outline: "border border-gray-600 hover:bg-gray-700/20 text-gray-300 transition-colors"
  },
  input: "bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent",
  progressBar: "h-2 bg-gray-700 rounded-full overflow-hidden",
  skeleton: "animate-pulse bg-gray-700/50 rounded"
};

// Helper fonksiyonlar
export const combineStyles = (...styles: ClassValue[]): string => {
  return styles.filter(Boolean).join(" ");
};

