import { useState } from "react";
import Modal from "react-modal";
import { useFoodStore } from "../store/foodStore";
import { toast } from "react-toastify";
import { UtensilsCrossed, IndianRupee } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddFood: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createFood } = useFoodStore();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [warning, setWarning] = useState("");

  const handleAdd = async () => {
    if (!name || !price) {
      setWarning("⚠ Please add name and price");
      return;
    }

    try {
      await createFood(name, Number(price));

      toast.success("Food created successfully!", {
        position: "bottom-center",
      });

      setName("");
      setPrice("");
      setWarning("");
      onClose();
    } catch (error) {
      setWarning("Failed to create food");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white w-full max-w-md mx-auto rounded-3xl shadow-2xl p-8 outline-none animate-fadeIn"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
          <UtensilsCrossed size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Add Food Item
          </h2>
          <p className="text-sm text-gray-400">
            Create a new food item
          </p>
        </div>
      </div>

      {warning && (
        <div className="mb-5 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-lg font-medium">
          {warning}
        </div>
      )}

      <div className="space-y-5">

        <div>
          <label className="text-sm font-medium text-gray-600">
            Food Name
          </label>

          <div className="flex items-center border rounded-xl px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-purple-500">
            <UtensilsCrossed size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter food name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setWarning("");
              }}
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Price
          </label>

          <div className="flex items-center border rounded-xl px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-purple-500">
            <IndianRupee size={16} className="text-gray-400 mr-2" />
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                setWarning("");
              }}
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-8">

        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleAdd}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium shadow-md hover:scale-105 hover:shadow-lg transition"
        >
          Add Food
        </button>

      </div>
    </Modal>
  );
};

export default AddFood;