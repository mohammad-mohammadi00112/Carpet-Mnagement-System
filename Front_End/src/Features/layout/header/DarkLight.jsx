
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const DarkLight = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      className="flex items-center justify-center w-10 h-10 rounded-xl  bg-gray-100 dark:bg-[#1E293B] text-[#14B8A6] hover:bg-gray-200 dark:hover:bg-[#334155] transition-all duration-300"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme">
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default DarkLight;