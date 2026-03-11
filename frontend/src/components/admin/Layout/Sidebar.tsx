import LOGO from "../../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { CookingPot, Home, User, UtensilsCrossed } from "lucide-react";
import { GiCookingPot } from "react-icons/gi";
import { FaMoneyBill } from "react-icons/fa6";

interface SidebarItem {
  name: string;
  route: string;
  svg: any;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {

  const items: SidebarItem[] = [
    { name: "Dashboard", route: "/dashboard", svg: <Home size={24} /> },
    { name: "Orders", route: "/orders", svg: <CookingPot size={24} /> },
    { name: "User Info", route: "/user-info", svg: <User size={24} /> },
    { name: "Menu", route: "/menu", svg: <GiCookingPot size={24} /> },
    { name: "All Food", route: "/foods", svg: <UtensilsCrossed size={24} /> },
    { name: "Add Money", route: "/add-money", svg: <FaMoneyBill size={24} /> }
  ];

  return (
    <div
      className={`
    fixed lg:relative top-0 left-0 h-full
    bg-white border-r border-gray-200
    transition-all duration-300 ease-in-out
    z-50 overflow-hidden

    ${isOpen
          ? "w-64 translate-x-0"
          : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
        }
  `}
    >

      <div className="p-4 border-b border-gray-200 flex justify-center">
        <img
          src={LOGO}
          alt="logo"
          className={`${isOpen ? "w-full h-9.5" : "w-10 h-9.5"} object-contain`}
        />
      </div>

      <div className="flex flex-col gap-2 px-4 mt-4">
        {items.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            onClick={() => {
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={({ isActive }) =>
              `px-4 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-3 text-sm ${isActive ? "bg-[#7B2FF7] text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="w-6 h-6 shrink-0">{item.svg}</span>
            <span className={`${!isOpen ? "lg:hidden" : ""}`}>{item.name}</span>
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;