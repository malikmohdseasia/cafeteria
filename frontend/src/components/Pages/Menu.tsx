import { useEffect, useState } from "react";
import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import DisplayMenu from "./DisplayMenu";
import { useMenuStore } from "../../store/menuStore";
import { useDailyMenuStore } from "../../store/dailyMenuStore";
import { useFoodStore } from "../../store/foodStore";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useCategoryStore } from "../../store/categoryStore";
import AddFoodModal from "./AddFood";

const Menu = () => {

  const [activeTab, setActiveTab] = useState<string>("");
  const [menuData, setMenuData] = useState<any>({});
  const [warning, setWarning] = useState<string>("");
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFoods, setSelectedFoods] = useState<any>([]);

  const { fetchMenu, menu, addFoodWithCategory, deleteItem, updateItem } = useMenuStore();
  const { fetchDailyMenu, addItemToDailyMenu, dailyMenu }: any = useDailyMenuStore();
  const { fetchFoods, foods } = useFoodStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItemData, setEditItemData] = useState<{ categoryId: string; foodId: string; name: string; price: number } | null>(null);

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchFoods();
    fetchDailyMenu();
    fetchMenu();
    fetchCategories();
  }, [editItemData]);

  useEffect(() => {
    if (Array.isArray(menu) && menu.length > 0) {
      const formattedMenu: any = {};

      menu.forEach((category: any) => {
        formattedMenu[category.categoryName] = category.items.map(
          (item: any) => ({
            categoryId: category.categoryId,
            id: item.id,
            name: item.name,
            price: item.price,
          })
        );
      });

      setMenuData(formattedMenu);

      if (!activeTab) {
        setActiveTab(menu[0].categoryName);
      }
    }
  }, [menu]);

  const handleRemove = async () => {
    if (!selectedId || !selectedCategory) return;

    await deleteItem(selectedCategory, selectedId);
    toast.success("Successfully Deleted!", {
      position: "bottom-center"
    })

    await fetchMenu();
    await fetchDailyMenu();

    setIsDeleteModalOpen(false);
    setSelectedId(null);
    setSelectedCategory("");
  };

  const isFoodAlreadyInCategory = (foodId: string) => {
    if (!selectedCategory) return false;

    const categoryItems = menuData[selectedCategory] || [];

    return categoryItems.some((item: any) => item.id === foodId);
  };

  const isAlreadyInDailyMenu = (foodId: string) => {
    if (!dailyMenu) return false;

    return dailyMenu.some((item: any) => item.foodId === foodId);
  };


  useEffect(() => {
    if (categories?.length && !activeTab) {
      setActiveTab(categories[0].name);
    }
  }, [categories]);


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-lg font-semibold mb-6">Menu</h1>

      <div className="flex justify-between items-center border-b border-gray-300 mb-6">
        <div className="flex gap-6">
          {categories?.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => setActiveTab(cat.name)}
              className={`cursor-pointer pb-3 text-sm capitalize ${activeTab === cat.name
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600"
                }`}
            >
              {cat?.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-sm font-medium text-gray-700 hover:text-purple-600"
        >
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-12 lg:gap-20">
        {menuData[activeTab]?.length > 0 ? (
          menuData[activeTab].map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-between w-36 sm:w-40"
            >
              <h3 className="text-purple-600 font-medium text-sm sm:text-sm text-center">
                {item.name}
              </h3>

              <p className="text-gray-700 text-xs sm:text-sm mt-1">RS. {item.price}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditItemData({
                      categoryId: item.categoryId,
                      foodId: item.id,
                      name: item.name,
                      price: item.price,
                    });
                    setIsEditModalOpen(true);
                  }}
                  className="p-1 rounded-full bg-gray-100 hover:bg-purple-100 text-purple-600 transition duration-200"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => addItemToDailyMenu(item.categoryId, item.id)}
                  disabled={isAlreadyInDailyMenu(item.id)}
                  className={`p-1 rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition duration-200 px-2
        ${isAlreadyInDailyMenu(item.id)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                  {isAlreadyInDailyMenu(item.id) ? "Added" : "Add"}
                </button>

                <button
                  onClick={() => {
                    setSelectedId(item.id);
                    setSelectedCategory(item.categoryId);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition duration-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-3 opacity-30">🍽️</div>
            <p className="text-gray-400 text-sm font-medium">
              No items available
            </p>
          </div>
        )}
      </div>



      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="bg-white w-full max-w-4xl mx-auto rounded-3xl shadow-2xl p-8 outline-none animate-fadeIn max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              Add Food To Category
            </h2>

            {warning && (
              <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-600 text-sm font-medium">
                {warning}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsFoodModalOpen(true)}
            className="text-sm font-medium text-gray-700 hover:text-purple-600 flex items-center gap-2"
          >
            Add New Food  <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <UtensilsCrossed size={20} />
            </div>
          </button>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-5 shadow-inner">
            <h3 className="font-semibold mb-4 text-gray-700 text-lg">
              Categories
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {categories?.map((cat: any) => (
                <div
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setWarning("");
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedCategory === cat.name
                    ? "bg-purple-600 text-white shadow-md scale-[1.02]"
                    : "hover:bg-purple-100 hover:text-purple-700"
                    }`}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-inner">
            <h3 className="font-semibold mb-4 text-gray-700 text-lg">
              Foods
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {foods.map((food: any) => {
                const alreadyAdded = isFoodAlreadyInCategory(food._id);

                return (
                  <div
                    key={food._id}
                    onClick={() => {
                      if (alreadyAdded) return;

                      if (!selectedCategory) {
                        setWarning("⚠ Please select a category first");
                        return;
                      }

                      setSelectedFoods((prev:any) =>
                        prev.includes(food._id)
                          ? prev.filter((id:any) => id !== food._id)
                          : [...prev, food._id]
                      );
                      setWarning("");
                    }}
                    className={`p-3 rounded-xl flex justify-between transition-all duration-200
${alreadyAdded
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : selectedFoods.includes(food._id)
                          ? "bg-purple-600 text-white shadow-md scale-[1.02]"
                          : "cursor-pointer hover:bg-purple-100 hover:text-purple-700"
                      }`}
                  >
                    <span>{food.name}</span>
                    <span className="text-sm font-medium">₹{food.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              setSelectedCategory("");
              setSelectedFoods("");
              setWarning("");
            }}
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              if (!selectedCategory) {
                setWarning("⚠ Please select a category first");
                return;
              }

              if (selectedFoods.length === 0) {
                setWarning("⚠ Please select at least one food");
                return;
              }

              await addFoodWithCategory(selectedCategory, selectedFoods);

              setIsAddModalOpen(false);
              setSelectedCategory("");
              setSelectedFoods([]);
              setWarning("");

              await fetchMenu();
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-md"
          >
            Add Item
          </button>
        </div>
      </Modal>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-80 p-6">
            <h2 className="text-lg font-semibold mb-3">
              Confirm Delete
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}



      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="bg-white w-full max-w-md mx-auto rounded-3xl shadow-2xl p-8 outline-none animate-fadeIn max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Food
        </h2>

        {editItemData && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editItemData.name}
                onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={editItemData.price}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, price: Number(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!editItemData) return;

                  await updateItem(
                    editItemData.categoryId,
                    editItemData.foodId,
                    editItemData.name,
                    editItemData.price
                  );

                  toast.success("Item updated successfully!", {
                    position: "bottom-center",
                  });

                  setIsEditModalOpen(false);
                  setEditItemData(null);
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>

      <DisplayMenu key={activeTab} activeTab={activeTab} />
      <AddFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
      />
    </div>
  );
};

export default Menu;