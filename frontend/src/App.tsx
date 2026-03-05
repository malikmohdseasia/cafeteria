import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/Pages/ProtectedRoute"
import LoginRoute from "./components/Pages/LoginRoute"
import { lazy, Suspense } from "react"
import ForUser from "./components/Pages/ForUser"
import ErrorBoundary from "./components/common/ErrorBoundary"
import withErrorBoundary from "./components/common/withErrorBoundry";
import {ToastContainer} from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

const App = () => {


  const Login = withErrorBoundary(lazy(() => import('./components/auth/Login')));
  const Signup = withErrorBoundary(lazy(() => import('./components/auth/Signup')));
  const Layout = withErrorBoundary(lazy(() => import('./components/Layout/Layout')));
  const Home = withErrorBoundary(lazy(() => import('./components/Pages/Home')));
  const Dashboard = withErrorBoundary(lazy(() => import("./components/Pages/Dashboard")));
  const Orders = withErrorBoundary(lazy(() => import("./components/Pages/Orders")));
  const UserInfo = withErrorBoundary(lazy(() => import("./components/Pages/UserInfo")));
  const Menu = withErrorBoundary(lazy(() => import("./components/Pages/Menu")));
  const NotFound = withErrorBoundary(lazy(() => import("./components/Pages/NotFound")));

  return (
    <BrowserRouter>
    <ToastContainer/>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>}>
          <Routes>
            <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
            <Route path="/signup" element={<LoginRoute><Signup /></LoginRoute>} />
            <Route path="/" element={<ProtectedRoute allowedRoles={["ADMIN"]}> <Layout /></ProtectedRoute>} >
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["USER"]}><ForUser /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

    </BrowserRouter >
  )
}

export default App
