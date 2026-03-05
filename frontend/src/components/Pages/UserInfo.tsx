import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useWalletStore } from "../../store/walletStore";





const UserInfo = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
    const {pendingUsers, fetchPendingUsers} = useAuthStore();
    const {getWalletHistory, walletHistory} = useWalletStore();
    

 const filteredUsers = pendingUsers
  .map((user:any) => ({
    employeeId: user?.email, 
    name: user?.name,
    pendingBill: user?.pending,
    wallet: user?.wallet,
  }))
  .filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employeeId.includes(searchTerm)
  )
  .filter((user) => {
    if (filter === "high") return user.pendingBill > 1000;
    if (filter === "low") return user.pendingBill <= 1000;
    return true;
  });

 const filteredWallet = walletHistory.filter(
  (item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employeeId.includes(searchTerm)
);
const downloadExcel = () => {
  const headers = [
    "Employee Name",
    "Employee Id",
    "Payment",
    "Wallet Balance",
    "Date",
    "Time",
  ];

  const rows = walletHistory.map((item) =>
    [
      item.name,
      item.employeeId,
      item.payment,
      item.walletBalance,
      item.date,
      item.time,
    ].join(",")
  );

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "wallet-history.csv";
  link.click();
};


  useEffect(()=>{
    fetchPendingUsers();
    getWalletHistory();
  },[])

 return (
  <div className="bg-gray-100 p-4 sm:p-6 rounded-lg w-full">

    <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-gray-300 mb-6">
      <button
        onClick={() => {
          setActiveTab("users");
          setSearchTerm("");
        }}
        className={`pb-3 text-sm font-medium ${
          activeTab === "users"
            ? "text-purple-600 border-b-2 border-purple-600"
            : "text-gray-500"
        }`}
      >
        User List
      </button>

      <button
        onClick={() => {
          setActiveTab("wallet");
          setSearchTerm("");
        }}
        className={`pb-3 text-sm font-medium ${
          activeTab === "wallet"
            ? "text-purple-600 border-b-2 border-purple-600"
            : "text-gray-500"
        }`}
      >
        Wallet History
      </button>
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-md border border-gray-200 shadow-sm">

      {activeTab === "users" && (
        <>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-auto"
            >
              <option value="all">Quick Filter</option>
              <option value="high">Pending &gt; 1000</option>
              <option value="low">Pending ≤ 1000</option>
            </select>

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 border border-purple-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm text-left">
              <thead className="border-b border-purple-600">
                <tr className="text-gray-600">
                  <th className="py-3">Employee Id</th>
                  <th>Name</th>
                  <th>Pending Bill</th>
                  <th>Wallet</th>
                </tr>
              </thead>

              <tbody>
  {filteredUsers.length > 0 ? (
    filteredUsers.map((user, index) => (
      <tr
        key={index}
        className="border-b border-gray-200 hover:bg-gray-50"
      >
        <td className="py-3">{user.employeeId}</td>
        <td>{user.name}</td>
        <td className="text-red-600 font-medium">
          {user.pendingBill}
        </td>
        <td>{user.wallet}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center py-6 text-gray-400">
        No matching records found
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "wallet" && (
        <>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <button
              onClick={downloadExcel}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition w-full sm:w-auto"
            >
              Download Excel
            </button>

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 border border-purple-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[750px] w-full text-sm text-left">
              <thead className="border-b border-purple-600">
                <tr className="text-gray-600">
                  <th className="py-3">Employee Name</th>
                  <th>Employee Id</th>
                  <th>Payment</th>
                  <th>Wallet Balance</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredWallet.length > 0 ? (
                  filteredWallet.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3">{item.name}</td>
                      <td>{item.employeeId}</td>
                      <td>{item.payment}</td>
                      <td>{item.walletBalance}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  </div>
);
};

export default UserInfo;