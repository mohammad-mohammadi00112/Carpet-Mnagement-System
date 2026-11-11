
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <main
      className="
        flex-1 min-w-0 min-h-0
        w-full
        overflow-y-auto overflow-x-hidden
        bg-slate-50 dark:bg-slate-950
        text-slate-800 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div
        className="
          w-full min-w-0
          min-h-full
          p-3 sm:p-5 lg:p-6 xl:p-8
        "
      >
        <Outlet />
      </div>
    </main>
  );
};

export default MainContent;