import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash2 } from "lucide-react";
import { useFoodStore } from "../../store/foodStore";
import { toast } from "react-toastify";

interface Food {
    _id: string;
    name: string;
    price: number;
}




const Foods = () => {
    const { foods, fetchFoods, deleteFood, updateFood } = useFoodStore();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFoodId, setEditFoodId] = useState<string | null>(null);
    const [foodName, setFoodName] = useState("");
    const [foodPrice, setFoodPrice] = useState<number>(0);


    const openDeleteModal = (id: string) => {
        setSelectedFoodId(id);
        setIsDeleteModalOpen(true);
    };


    const handleRemove = async () => {
        if (!selectedFoodId) return;

        await deleteFood(selectedFoodId);

        setIsDeleteModalOpen(false);
        setSelectedFoodId(null);
        toast.success("Successfully Deleted!",
            {
                position: 'bottom-center'
            }
        )
    };

    const openEditModal = (food: Food) => {
        setEditFoodId(food._id);
        setFoodName(food.name);
        setFoodPrice(food.price);
        setIsEditModalOpen(true);
    };

    const handleUpdateFood = async () => {
        try {
            if (!editFoodId) return;

            await updateFood(editFoodId, foodName, foodPrice);

            setIsEditModalOpen(false);

            toast.success("Food updated successfully", {
                position: "bottom-center",
            });
        } catch (error) {
            toast.error("Failed to update food", {
                position: "bottom-center",
            });
        }
    };


    const columns: TableColumn<Food>[] = [
        {
            name: "Food Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Price (₹)",
            selector: (row) => row.price,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => openEditModal(row)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                        <Edit size={18} />
                    </button>

                    <button
                        onClick={() => openDeleteModal(row._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchFoods();
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">

            <h2 className="text-xl font-semibold mb-4">Foods</h2>
            <DataTable
                columns={columns}
                data={foods}
                pagination
                highlightOnHover
                striped
                responsive
            />
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-80 p-6">
                        <h2 className="text-lg font-semibold mb-3">
                            Confirm Delete
                        </h2>

                        <p className="text-gray-500 mb-4">
                            Are you sure you want to delete this food?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 border rounded-md cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleRemove}
                                className="px-4 py-2 bg-[#7B2FF7] text-white rounded-md cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-96 p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            Edit Food
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <label className="text-sm text-gray-600">
                                    Food Name
                                </label>
                                <input
                                    value={foodName}
                                    onChange={(e) => setFoodName(e.target.value)}
                                    className="w-full mt-1 border rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={foodPrice}
                                    onChange={(e) => setFoodPrice(Number(e.target.value))}
                                    className="w-full mt-1 border rounded-md px-3 py-2"
                                />
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 border rounded-md cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateFood}
                                className="px-4 py-2 bg-[#7B2FF7] text-white rounded-md cursor-pointer"
                            >
                              Update
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Foods
