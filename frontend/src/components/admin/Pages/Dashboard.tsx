import CircularChart from "./CircularChart";
import { FaShoppingCart, FaDollarSign, FaUsers, FaWallet } from "react-icons/fa";
import TrendingMenu from "./TrendingMenu";
import RevenueChart from "./RevenueChart";
import { useDashboardStore } from "../store/dashboardStore";
import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import DataTable from "react-data-table-component";




const Dashboard = () => {

  const columns = [
    {
      name: "Employee Email",
      selector: (row: any) => row?.user?.email,
    },
    {
      name: "Status",
      selector: (row: any) => row?.status,
    },
    {
      name: "Price",
      selector: (row: any) => `₹${row?.totalAmount}`,
    },
   {
  name: "Payment Status",
  selector: (row: any) => row?.paymentStatus,
  cell: (row: any) => {
    let bgColor = "bg-gray-200 text-gray-800"; // default

    if (row.paymentStatus === "PAID") bgColor = "bg-green-100 text-green-800";
    else if (row.paymentStatus === "PENDING") bgColor = "bg-yellow-100 text-yellow-800";
   

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
        {row.status}
      </span>
    );
  },
},
  ];


  const [viewAll, setViewAll] = useState(false);
  const { fetchDashboard, dashboard }: any = useDashboardStore();
  const { fetchRecentOrders, recentOrders } = useOrderStore();


  const items = [
    {
      name: "Pending Orders",
      value: dashboard?.pendingOrders ?? 0,
      percentage: dashboard?.pendingOrders
        ? Math.min(dashboard.pendingOrders * 10, 100)
        : 0,
      icon: <FaShoppingCart />,
    },
    {
      name: "Today's Revenue",
      value: `₹${dashboard?.totalRevenue ?? 0}`,
      percentage: dashboard?.totalRevenue
        ? Math.min(dashboard.totalRevenue / 10, 100)
        : 0,
      icon: <FaDollarSign />,
    },
    {
      name: "Admin Wallet Recharge",
      value: `₹${dashboard?.totalAdminRecharge ?? 0}`,
      percentage: dashboard?.totalAdminRecharge
        ? Math.min(dashboard.totalAdminRecharge / 10, 100)
        : 0,
      icon: <FaWallet />,
    },
    {
      name: "Total Customers",
      value: dashboard?.totalCustomers ?? 0,
      percentage: dashboard?.totalCustomers
        ? Math.min(dashboard.totalCustomers * 10, 100)
        : 0,
      icon: <FaUsers />,
    },
  ];


  useEffect(() => {
    fetchDashboard();
    fetchRecentOrders();
  }, []);




  return (


    <div>


      <div className="grid sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl px-6 py-5 
                 flex items-center justify-between 
                 hover:shadow-lg transition-shadow duration-300"
          >
            <div>
              <p className="text-gray-500 text-[12px] font-medium">
                {item.name}
              </p>

              <p className="text-[18px] font-semibold mt-2 italic">
                {item.value}
              </p>
            </div>

            <div className="w-22.5 h-22.5">
              <CircularChart
                percentage={item.percentage}
                icon={item.icon}
              />
            </div>
          </div>
        ))}
      </div>


      <div className="w-full my-10 shadow-md bg-white p-2 rounded-lg">
        <h1 className="text-gray-500 text-[14px] mb-2">Recent Order Items</h1>

        <div className="flex w-full items-center mb-2">
          <div className="flex-1 h-5"></div>

          <button
            onClick={() => setViewAll(!viewAll)}
            className="text-white text-[12px] bg-[#7B2FF7] px-3 py-1 rounded-lg"
          >
            {viewAll ? "Show Less" : "View All"}
          </button>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="min-h-100">
            <DataTable
              columns={columns}
              data={viewAll ? recentOrders : recentOrders?.slice(0, 2)}
              pagination={viewAll}
              paginationPerPage={10}
              highlightOnHover
              striped
            />
          </div>
        ) : (
          <h1 className="text-gray-500 text-[14px]">
            no items present in the recent order list
          </h1>
        )}
      </div>


      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <TrendingMenu />
        <RevenueChart />
      </div>

    </div>


  )
}

export default Dashboard
