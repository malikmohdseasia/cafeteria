import LOGO from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { CookingPot, Home, User } from "lucide-react";
import { GiCookingPot } from "react-icons/gi";

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
    { name: "Dashboard", route: "/dashboard", svg: <Home/> },
    { name: "Orders", route: "/orders", svg: <CookingPot/> },
    { name: "User Info", route: "/user-info", svg: <User/> },
    { name: "Menu", route: "/menu", svg: <GiCookingPot size={'25'}/> }
  ];

  return (
    <div
  className={`
    fixed lg:relative top-0 left-0 h-full
    bg-white border-r border-gray-200
    transition-all duration-300 ease-in-out
    z-50 overflow-hidden

    ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0"}
  `}
>

      <div className="p-4 border-b">
        <img src={LOGO} alt="logo" className="w-full h-16 object-contain" />
      </div>

      <div className="flex flex-col gap-2 px-4 mt-4">
        {items.map((item) => (
         <NavLink
  key={item.route}
  to={item.route}
  onClick={() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false); 
    }
  }}
  className={({ isActive }) =>
    `px-4 py-3 rounded-md font-medium transition-all duration-300 flex items-center gap-3 text-sm ${
      isActive
        ? "bg-[#7B2FF7] text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`
  }
>
  {item.svg}
  {item.name}
</NavLink>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;