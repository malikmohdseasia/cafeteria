import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { PlusCircle } from "lucide-react";
import { useWalletStore } from "../../store/walletStore";
import { toast } from "react-toastify";


interface User {
    _id: string;
    name: string;
    email: string;
    wallet: number;
}

const AddMoney = () => {

    const { getAllUsers, users, addMoney } = useWalletStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string | number>("");

    const openModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const handleAddMoney = async () => {
        if (!selectedUserId || !amount) {
            toast.error("Enter amount");
            return;
        }

        try {
            await addMoney(selectedUserId, amount)
            console.log(selectedUserId, amount)

            toast.success("Money added successfully", {
                position: "bottom-center",
            });

            setIsModalOpen(false);
            setAmount(0);

            getAllUsers();

        } catch (error) {
            toast.error("Failed to add money");
        }
    };

    const columns: TableColumn<User>[] = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Employee ID",
            selector: (row) => row.email,
        },
        {
            name: "Wallet Balance (₹)",
            selector: (row) => row.wallet,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    onClick={() => openModal(row._id)}
                    className="flex items-center gap-1 bg-[#7B2FF7] text-white px-3 py-1 rounded-md hover:bg-purple-700"
                >
                    <PlusCircle size={16} />
                    Add Money
                </button>
            ),
        },
    ];


    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">

            <h2 className="text-xl font-semibold mb-4">
                Add Money To Wallet
            </h2>

            <DataTable
                columns={columns}
                data={users}
                pagination
                highlightOnHover
                striped
                responsive
            />


            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

                    <div className="bg-white rounded-xl shadow-lg w-96 p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            Add Money
                        </h2>

                        <input
                            type="number"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border rounded-md px-3 py-2"
                        />

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddMoney}
                                className="px-4 py-2 bg-[#7B2FF7] text-white rounded-md"
                            >
                                Add
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddMoney
