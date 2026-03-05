import { useEffect, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { cancelOrderApi } from "../../api/OrderApi";
import { toast } from "react-toastify";
import { useAnalyticsStore } from "../../store/analyticsStore";

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const ranges = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 15 Days", value: "15days" },
  { label: "Last 30 Days", value: "30days" },
];

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { fetchOrders, orders, fetchPendingOrders, pendingOrders, updateOrderStatus } = useOrderStore();
  const [showQuickDownload, setShowQuickDownload] = useState(false);
  const [selectedRange, setSelectedRange] = useState("today");

  const { downloadOrders } = useAnalyticsStore();

  useEffect(() => {
    fetchOrders();
    fetchPendingOrders();
  }, []);

  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const currentData: any =
    activeTab === "pending" ? pendingOrders : orders;

  const filteredOrders = currentData
    .filter((order: Order) => {
      const matchesSearch =
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.includes(searchTerm) ||
        order.user._id.includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  const confirmDelete = async () => {
    if (!selectedOrderId) return;

    try {
      await cancelOrderApi(selectedOrderId);
      toast.success("Order cancelled successfully", {
        position: "bottom-center",
      });

      fetchPendingOrders();

      setIsDeleteOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg w-full">
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-87.5 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Confirm
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this pending order?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 cursor-pointer"
              >
                No
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-[#7B2FF7] text-white cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-gray-300 mb-6">
        <button
          onClick={() => {
            setActiveTab("pending");
            setSearchTerm("");
          }}
          className={`pb-3 text-sm font-medium cursor-pointer ${activeTab === "pending"
            ? "text-purple-600 border-b-2 border-purple-600"
            : "text-gray-500"
            }`}
        >
          Pending Orders
        </button>

        <button
          onClick={() => {
            setActiveTab("history");
            setSearchTerm("");
          }}
          className={`pb-3 text-sm font-medium cursor-pointer ${activeTab === "history"
            ? "text-purple-600 border-b-2 border-purple-600"
            : "text-gray-500"
            }`}
        >
          Order History
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-md border border-gray-200 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">

          <div className="flex flex-wrap gap-3">
           

            <div className="relative">
              <button
                onClick={() => setShowQuickDownload(!showQuickDownload)}
                className="border border-gray-300 px-3 py-2 rounded-md text-sm bg-white"
              >
                Quick Download
              </button>

              {showQuickDownload && (
                <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-lg z-50 p-3 space-y-2">

                  <div className="space-y-1">
                    {ranges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedRange(range.value)}
                        className={`block w-full text-left px-2 py-1 rounded ${selectedRange === range.value ? "bg-purple-100" : ""
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>

                  <hr />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        downloadOrders(activeTab, selectedRange, "pdf");
                        setShowQuickDownload(false);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      PDF
                    </button>

                    <button
                      onClick={() => {
                        downloadOrders(activeTab, selectedRange, "excel");
                        setShowQuickDownload(false);
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Excel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {
              activeTab === 'history' && <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md text-sm"
              >
                <option value="ALL">All Orders</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="CONFIRMED">Confirmed</option>
              </select>
            }
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-64 border border-purple-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-175 w-full text-sm text-left">
            <thead className="border-b border-purple-600">
              <tr className="text-gray-600">
                <th className="py-3">Date</th>
                <th>Order Id</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Order Status</th>
                <th>Total Amount</th>

              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: Order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>{order._id}</td>
                    <td>{order.user.email}</td>
                    <td>{order.user.name}</td>
                    <td
                      className={`font-medium ${order.status.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                        }`}
                    >
                      {order.status}
                    </td>
                    <td>{order.totalAmount}</td>
                    <td>
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => {
                            setSelectedOrderId(order._id);
                            setIsDeleteOpen(true);
                          }}
                          className="bg-[#7B2FF7] text-white px-2 py-1 rounded cursor-pointer mx-2"
                        >
                          Cancel
                        </button>
                      )}
                    </td>

                    <td>
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => {
                            updateOrderStatus(order._id, "CONFIRMED")
                            toast.success("Order Confirmed successfully", {
                              position: "bottom-center",
                            });
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
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

      </div>
    </div>
  );
};

export default Orders;