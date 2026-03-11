import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/admin/Pages/ProtectedRoute"
import LoginRoute from "./components/admin/Pages/LoginRoute"
import { lazy, Suspense } from "react"
import ErrorBoundary from "./components/common/ErrorBoundary"
import withErrorBoundary from "./components/common/withErrorBoundry";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import Foods from "./components/admin/Pages/Foods"
import AddMoney from "./components/admin/Pages/AddMoney"

Modal.setAppElement("#root");

const App = () => {


  const Login = withErrorBoundary(lazy(() => import('./components/auth/Login')));
  const Signup = withErrorBoundary(lazy(() => import('./components/auth/Signup')));
  const Layout = withErrorBoundary(lazy(() => import('./components/admin/Layout/Layout')));
  const Home = withErrorBoundary(lazy(() => import('./components/admin/Pages/Home')));
  const Dashboard = withErrorBoundary(lazy(() => import("./components/admin/Pages/Dashboard")));
  const Orders = withErrorBoundary(lazy(() => import("./components/admin/Pages/Orders")));
  const UserInfo = withErrorBoundary(lazy(() => import("./components/admin/Pages/UserInfo")));
  const Menu = withErrorBoundary(lazy(() => import("./components/admin/Pages/Menu")));
  const NotFound = withErrorBoundary(lazy(() => import("./components/admin/Pages/NotFound")));




  const UserLayout = withErrorBoundary(lazy(() => import("./components/user/Layout/Layout")));
  const UserHome = withErrorBoundary(lazy(() => import("./components/user/Pages/Home")));
  const UserMenu = withErrorBoundary(lazy(() => import("./components/user/Pages/Menu")));

  return (
    <BrowserRouter>
      <ToastContainer />
      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>}>

         


          <Routes>
            <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
            <Route path="/signup" element={<LoginRoute><Signup /></LoginRoute>} />


            <Route
  path="/"
  element={
    <ProtectedRoute allowedRoles={["USER"]}>
      <UserLayout />
    </ProtectedRoute>
  }
>
  <Route path="/" element={<UserHome />} />
  <Route path="/menu" element={<UserMenu />} />
  <Route path="*" element={<NotFound />} />
</Route>



            {/* <Route path="/" element={<ProtectedRoute allowedRoles={["ADMIN"]}> <Layout /></ProtectedRoute>} >
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/foods" element={<Foods />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/add-money" element={<AddMoney />} />
              <Route path="*" element={<NotFound />} />
            </Route> */}

          </Routes>
        </Suspense>
      </ErrorBoundary>

    </BrowserRouter >
  )
}

export default App
