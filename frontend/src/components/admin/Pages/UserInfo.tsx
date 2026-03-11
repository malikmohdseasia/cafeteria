import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useAuthStore } from "../store/authStore";
import { useWalletStore } from "../store/walletStore";
import { useSearchStore } from "../store/searchStore";

const UserInfo = () => {

  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "excel">("pdf");
  const [activeTab, setActiveTab] = useState<"users" | "wallet">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "low">("all");

  const { pendingUsers, fetchPendingUsers, searchPendingUsers, downloadPendingUsers } = useAuthStore();
  const { getWalletHistory, filterWalletUsers, downloadWalletHistory } = useWalletStore();
  const { searchWallet, searchData } = useSearchStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab === "wallet") {
      searchWallet(debouncedSearch || "");
    }
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    if (activeTab === "users") {
      if (debouncedSearch.trim() === "") {
        fetchPendingUsers();
      } else {
        searchPendingUsers(debouncedSearch);
      }
    }
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    fetchPendingUsers();
    getWalletHistory();
  }, []);

  const sourceUsers = activeTab === "users" ? pendingUsers : searchData;

  const filteredUsers = sourceUsers
    .map((user: any) => ({
      employeeId: user?.email || user?.user?.email,
      name: user?.name || user?.user?.name,
      pendingBill: user?.pending || user?.pendingBill || 0,
      wallet: user?.wallet || user?.balance || 0,
      date: user?.createdAt,
    }))
    .filter((user) => activeTab === "users" ? user.pendingBill > 0 : true)
    .filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.includes(searchTerm)
    )
    .filter((user) => {
      if (filter === "high") return user.pendingBill > 1000;
      if (filter === "low") return user.pendingBill <= 1000;
      return true;
    });

  const userColumns = [
    { name: "Employee Id", selector: (row: any) => row.employeeId, sortable: true },
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    { name: "Pending Bill", selector: (row: any) => `₹${row.pendingBill}`, sortable: true },
    { name: "Wallet", selector: (row: any) => `₹${row.wallet}`, sortable: true },
  ];

  const walletColumns = [
    { name: "Employee Name", selector: (row: any) => row.name || row.user?.name, sortable: true },
    { name: "Employee Id", selector: (row: any) => row.employeeId || row.user?.email, sortable: true },
    { name: "Wallet Balance", selector: (row: any) => `₹${row.subtotal || row.wallet}`, sortable: true },
    { name: "Date", selector: (row: any) => row.date ? new Date(row.date).toLocaleDateString() : "", sortable: true },
    { name: "Time", selector: (row: any) => row.date ? new Date(row.date).toLocaleTimeString() : "", sortable: true },
  ];

  const customStyles = {
    headCells: { style: { fontWeight: "600", fontSize: "14px", backgroundColor: "#fafafa" } },
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg w-full">
      <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-gray-300 mb-6">
        <button
          onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
          className={`pb-3 text-sm font-medium ${activeTab === "users" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"}`}
        >
          User List
        </button>

        <button
          onClick={() => { setActiveTab("wallet"); setSearchTerm(""); }}
          className={`pb-3 text-sm font-medium ${activeTab === "wallet" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"}`}
        >
          Wallet History
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">

          {activeTab === "users" && (
            <select
              value={filter}
              onChange={(e) => {
                const value = e.target.value as "all" | "high" | "low";
                setFilter(value);

                if (value === "high") filterWalletUsers("gt", 1000);
                else if (value === "low") filterWalletUsers("lt", 1000);
                else fetchPendingUsers();
              }}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-auto"
            >
              <option value="all">Quick Filter</option>
              <option value="high">Pending &gt; 1000</option>
              <option value="low">Pending ≤ 1000</option>
            </select>
          )}

          {activeTab === "users" && (
            <div className="flex gap-2">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as "pdf" | "excel")}
                className="border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>

              <button
                onClick={() => downloadPendingUsers(downloadFormat)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
              >
                Download
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-64 border border-purple-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {activeTab === "wallet" && (
            <div className="flex gap-2">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as "pdf" | "excel")}
                className="border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>

              <button
                onClick={() => downloadWalletHistory(downloadFormat)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
              >
                Download
              </button>
            </div>
          )}

        </div>

        <DataTable
          columns={activeTab === "users" ? userColumns : walletColumns}
          data={filteredUsers}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50]}
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
          noDataComponent="No matching records found"
        />
      </div>
    </div>
  );
};

export default UserInfo;