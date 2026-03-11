
import { LogOut, User } from "lucide-react";
import LOGO from "../../../assets/UserLogo.svg"
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LogoutModal from "../../admin/Pages/Logout";
import { useAuthStore } from "../../admin/store/authStore";
import { useState } from "react";

const Navbar = () => {
    const items = [{ name: "Home", route: '/' }, { name: "Menu", route: "/menu" }, { name: "About", route: "/about" },  { name: "Contact", route: "/contact" }];
    const [openModal, setOpenModal] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        logout();
        toast.success("Logout Successfully!")
        navigate("/login", { replace: true });
    };
    return (
        <div>
            <div className="flex justify-between mt-3 items-center">
                <div className="flex items-center gap-2">
                    <img src={LOGO} alt="logo" />
                    <h1 className="font-playfair italic font-bold text-2xl">Bistro Bliss</h1>
                </div>

                <div className="flex items-center gap-10">
                    {
                        items.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.route}
                                className={({ isActive }) =>
                                    `font-medium font-poppins ${isActive ? " text-[#B88E2F] border-b-3 border-yellow-500" : ""}`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))
                    }
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition">
                        <User size={26} className="text-gray-700" />
                    </div>
                    <button className="cursor-pointer"
                        onClick={() => setOpenModal(true)}
                    ><LogOut /></button>

                </div>
            </div>

            <LogoutModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    )
}

export default Navbar
