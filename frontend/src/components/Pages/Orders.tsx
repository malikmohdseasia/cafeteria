import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useOrderStore } from "../../store/orderStore";
import { cancelOrderApi } from "../../api/OrderApi";
import { toast } from "react-toastify";
import { useAnalyticsStore } from "../../store/analyticsStore";
import ConfirmModal from "./ConfirmModal";
import { ChevronRight, ChevronDown } from "lucide-react";

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
  { label: "Last 3 Days", value: "3days" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
];

const Orders = () => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const {
    fetchOrders,
    fetchPendingOrders,
    orders,
    pendingOrders,
    updateOrderStatus,
    fetchOrdersByStatus,
    searchOrders,
    searchPendingOrders
  } = useOrderStore();

  const [showQuickDownload, setShowQuickDownload] = useState(false);
  const [selectedRange, setSelectedRange] = useState("today");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void> | void>(() => { });
  const [confirmMessage, setConfirmMessage] = useState("");

  const { downloadOrders } = useAnalyticsStore();

  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");


  const currentData: any =
    activeTab === "pending" ? pendingOrders : orders;

  useEffect(() => {
    fetchPendingOrders();
  }, []);

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

  useEffect(() => {
    if (activeTab !== "history") return;

    if (statusFilter === "ALL") {
      fetchOrders(selectedRange);
    } else {
      fetchOrdersByStatus(statusFilter);
    }
  }, [statusFilter, activeTab, selectedRange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      if (activeTab === "history") {
        fetchOrders(selectedRange);

      } else if (activeTab === "pending") {
        fetchPendingOrders();
      }
      return;
    }

    if (activeTab === "history") {
      searchOrders(debouncedSearch);
    } else if (activeTab === "pending") {
      searchPendingOrders(debouncedSearch);
    }
  }, [debouncedSearch, activeTab]);

  const columns: any = [
    {
      name: "Date",
      selector: (row: any) =>
        activeTab === "pending"
          ? new Date(row.createdAt).toLocaleDateString()
          : new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row: any) =>
        activeTab === "pending" ? row._id : row._id,
      sortable: true,
    },
    {
      name: "Employee Email",
      selector: (row: any) =>
        activeTab === "pending"
          ? row.user?.email
          : row.user?.email,
    },
    {
      name: "Employee Name",
      selector: (row: any) =>
        activeTab === "pending"
          ? row.user?.name
          : row.user?.name,
    },
    {
      name: "Order Status",
      cell: (row: any) => (
        <span
          className={`font-medium ${activeTab === "pending"
            ? "text-yellow-600"
            : row.status === "CONFIRMED"
              ? "text-green-600"
              : "text-red-500"
            }`}
        >
          {activeTab === "pending" ? "PENDING" : row.status}
        </span>
      ),
    },
    {
      name: "Total Amount",
      selector: (row: any) => row.totalAmount,
    },
    ...(activeTab === "pending"
      ? [
        {
          name: "Action",
          minWidth: "180px",
          center: true,
          cell: (row: any) => (
            <div className="flex items-center justify-center gap-2 w-full">

              <button
                onClick={() => {
                  setSelectedOrderId(row._id);
                  setConfirmMessage(
                    "Are you sure you want to confirm this order?"
                  );
                  setConfirmAction(() => async () => {
                    updateOrderStatus(row.user._id, "CONFIRMED");
                    await fetchPendingOrders();
                    toast.success("Order Confirmed successfully", {
                      position: "bottom-center",
                    });
                    setIsDeleteOpen(false);
                  });
                  setIsDeleteOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#7B2FF7] hover:bg-green-600 text-white whitespace-nowrap"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  console.log("selected order:", row._id);

                  setSelectedOrderId(row._id);

                  setConfirmMessage("Are you sure you want to cancel this order?");

                  setConfirmAction(() => async () => {
                    if (!row._id) return;

                    await cancelOrderApi(row._id);

                    toast.success("Order cancelled successfully", {
                      position: "bottom-center",
                    });

                    await fetchPendingOrders();

                    setIsDeleteOpen(false);
                    setSelectedOrderId(null);
                  });

                  setIsDeleteOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                Cancel
              </button>
            </div>
          ),
        },
      ]
      : []),
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        backgroundColor: "#fafafa",
      },
    },
  };


  const ExpandedComponent = ({ data }: any) => {
    return (
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-md">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left border-b border-gray-300">
              <th className="py-2 px-3 border-r border-gray-300">Food Name</th>
              <th className="py-2 px-3 border-r border-gray-300">Price</th>
              <th className="py-2 px-3 border-r border-gray-300">Quantity</th>
              <th className="py-2 px-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {data.items?.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-2 px-3 border-r border-gray-300">{item.foodName}</td>
                <td className="py-2 px-3 border-r border-gray-300">{item.price}</td>
                <td className="py-2 px-3 border-r border-gray-300">{item.quantity}</td>
                <td className="py-2 px-3">{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg w-full">
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Confirm"
        message={confirmMessage}
        confirmText="Yes"
        cancelText="No"
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmAction}
      />

      <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-gray-300 mb-6">
        <button
          onClick={() => {
            setActiveTab("pending");
            setSearchTerm("");
          }}
          className={`pb-3 text-sm font-medium ${activeTab === "pending"
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
          className={`pb-3 text-sm font-medium ${activeTab === "history"
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
                  {ranges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedRange(range.value)}
                      className={`block w-full text-left px-2 py-1 rounded ${selectedRange === range.value
                        ? "bg-purple-100"
                        : ""
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}

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

            {activeTab === "history" && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                >
                  <option value="ALL">All Orders</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="CONFIRMED">Confirmed</option>
                </select>

                <select
                  value={selectedRange}
                  onChange={(e) => setSelectedRange(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                >
                  {ranges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-64 border border-purple-500 px-4 py-2 rounded-full text-sm"
          />
        </div>


        <DataTable
          columns={columns}
          data={currentData}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}

          expandableRows
          expandableRowsComponent={ExpandedComponent}
          expandableRowDisabled={(row) => !row.items || row.items.length === 0}

          expandableIcon={{
            collapsed: <ChevronRight size={18} />,
            expanded: <ChevronDown size={18} />,
          }}
        />
      </div>

    </div>
  );
};

export default Orders;