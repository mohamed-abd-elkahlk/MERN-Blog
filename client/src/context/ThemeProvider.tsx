import React from "react";
import { useAppSelector } from "../hook";
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
