import { Outlet } from "react-router-dom"
import Navbar from "../Pages/Navbar"

const Layout = () => {

  return (
    <div className="w-[95%] mx-auto">
      <>
        <Navbar />
       <main className="pt-4">
        <Outlet />
      </main>
      </>

    </div>
  )
}

export default Layout
