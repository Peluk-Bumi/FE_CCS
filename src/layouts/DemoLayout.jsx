import { Outlet, NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  MousePointerClick, 
  CreditCard, 
  Type, 
  Tag, 
  Layers, 
  ChevronDown, 
  AppWindow,
  Home
} from "lucide-react";

const navItems = [
  { name: "Overview", path: "/demo", icon: LayoutDashboard },
  { name: "Buttons", path: "/demo/buttons", icon: MousePointerClick },
  { name: "Cards", path: "/demo/cards", icon: CreditCard },
  { name: "Inputs", path: "/demo/inputs", icon: Type },
  { name: "Badges", path: "/demo/badges", icon: Tag },
  { name: "Tabs", path: "/demo/tabs", icon: Layers },
  { name: "Accordion", path: "/demo/accordion", icon: ChevronDown },
  { name: "Modals", path: "/demo/modals", icon: AppWindow },
];

export default function DemoLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 shadow-sm z-30">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            UI Components
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-1.5 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/demo"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-gray-700">
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-gray-700 dark:text-slate-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">UI Components</h1>
          </div>
          <Link to="/" className="text-sm font-medium text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
            <Home className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden overflow-x-auto border-b border-slate-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-[65px] z-20 flex whitespace-nowrap px-4 py-3 gap-2 hide-scrollbar shadow-sm">
           {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/demo"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-colors border ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-gray-800 dark:text-slate-300 dark:border-gray-700"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
        </div>

        {/* Content Outlet */}
        <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full pb-24 md:pb-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
