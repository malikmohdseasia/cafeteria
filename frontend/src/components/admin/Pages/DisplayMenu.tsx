import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Trash2 } from "lucide-react";
import { useDailyMenuStore } from "../store/dailyMenuStore";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface Props {
  activeTab: string;
}

const DisplayMenu: React.FC<Props> = ({ activeTab }) => {
  const { dailyMenu, deleteItemFromDailyMenu }: any = useDailyMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items: MenuItem[] = useMemo(() => {
    if (!dailyMenu || !activeTab) return [];

    return dailyMenu
      .filter(
        (item: any) =>
          item.categoryName?.toLowerCase() === activeTab?.toLowerCase()
      )
      .map((item: any) => ({
        id: item.foodId,
        name: item.foodName,
        price: item.price,
      }));
  }, [dailyMenu, activeTab]);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    await deleteItemFromDailyMenu(selectedId);

    setIsModalOpen(false);
    setSelectedId(null);
  };

  const columns = [
    {
      name: "Item Name",
      selector: (row: MenuItem) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Price",
      selector: (row: MenuItem) => `₹ ${row.price}`,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: MenuItem) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition duration-200"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f3f4f6",
        fontWeight: "600",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f9fafb",
        transition: "0.3s",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e5e7eb",
      },
    },
  };



  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Display Menu
      </h2>

      <DataTable
        columns={columns}
        data={items}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        noDataComponent={
          <div className="py-6 text-gray-400">
            No items available for this category
          </div>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 ">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedId(null);
                }}
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-[#7B2FF7] text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayMenu;