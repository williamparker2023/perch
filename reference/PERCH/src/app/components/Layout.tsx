import { Outlet, NavLink, useLocation, useNavigate, useSearchParams } from "react-router";
import { Home, Search, PlusSquare, Sparkles } from "lucide-react";
import { users } from "../data";
import clsx from "clsx";
import { CreateSelection } from "../pages/CreateSelection";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = users[0]; // Assumes first user is the logged in user
  const isPostRoute = location.pathname.startsWith("/post/new") || location.pathname.startsWith("/post/select-board") || location.pathname.startsWith("/board/new") || location.pathname.startsWith("/inspo/new");
  
  const isCreateModalOpen = searchParams.get("create") === "true";

  // Hide the bottom nav if we're in the post creation modal route
  if (isPostRoute) {
    return (
      <div className="max-w-md mx-auto h-screen bg-white relative overflow-hidden flex flex-col sm:border-x border-gray-200">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-white relative overflow-hidden flex flex-col sm:border-x border-gray-200 shadow-sm">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-[64px] scrollbar-hide">
        <Outlet />
      </div>

      {/* Create Modal Overlay */}
      {isCreateModalOpen && <CreateSelection onClose={() => navigate(location.pathname)} />}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 h-[64px] bg-white px-6 flex items-center justify-between z-50">
        <NavItem to="/" icon={<Home size={26} strokeWidth={2.5} />} />
        <NavItem to="/explore" icon={<Search size={26} strokeWidth={2.5} />} />
        
        {/* Create Button (Center Focus) */}
        <button
          onClick={() => {
            if (isCreateModalOpen) {
              navigate(location.pathname);
            } else {
              navigate({ search: "?create=true" });
            }
          }}
          className={clsx(
            "flex items-center justify-center w-12 h-12 transition-colors",
            isCreateModalOpen ? "text-black" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <PlusSquare size={30} strokeWidth={2.5} />
        </button>

        <NavItem to="/inspo" icon={<Sparkles size={26} strokeWidth={2.5} />} />
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            clsx(
              "w-8 h-8 rounded-full overflow-hidden border-2 transition-colors", 
              isActive ? "border-black" : "border-transparent opacity-80 hover:opacity-100"
            )
          }
        >
          <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
        </NavLink>
      </nav>
    </div>
  );
}

function NavItem({ to, icon }: { to: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex flex-col items-center justify-center w-12 h-12 gap-1 transition-colors",
          isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
        )
      }
    >
      {icon}
    </NavLink>
  );
}
