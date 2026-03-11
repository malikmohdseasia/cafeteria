import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
        alt="Cafeteria"
        className="w-40 md:w-56 mb-6"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.h1
        className="text-3xl md:text-5xl font-bold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Cafeteria ☕
      </motion.h1>

      <motion.p
        className="text-gray-500 mt-4 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Enjoy delicious meals, manage your orders, and explore our menu easily.
      </motion.p>
    </div>
  );
};

export default Home;