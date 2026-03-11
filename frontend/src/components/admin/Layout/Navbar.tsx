import {  LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../Pages/Logout";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import Notification from "../Pages/Notification";
import { toast } from "react-toastify";

const Navbar = ({ setIsOpen }: any) => {

  const [openModal, setOpenModal] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    logout();
    toast.success("Logout Successfully!")
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">

        <button
          onClick={() => setIsOpen((prev: any) => !prev)}
          className="cursor-pointer "
        >
          <Menu />
        </button>

        <div className="flex items-center gap-4">

            <div className="flex items-center gap-4">
            <Notification />
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
  );
};

export default Navbar;