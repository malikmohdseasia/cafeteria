import { useNavigate } from "react-router-dom";
import BGIMAGE from "../../../assets/BG.png";

const Home = () => {
  
  const navigate = useNavigate();

  return (
    <div
      className="bg-cover bg-center h-[85vh]"
      style={{ backgroundImage: `url(${BGIMAGE})` }}
    >
      <div className="flex flex-col gap-5 justify-center items-center text-center h-full px-112">
        <h1 className="font-playfair text-[50px]">Best food for
          your taste</h1>

        <p className="font-sans">Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven.</p>
      <button className="bg-[#AD343E] text-white px-5 py-2 rounded-full cursor-pointer"
      onClick={()=>navigate("/menu")}
      >Explore Menu</button>
      </div>
    </div>
  );
};

export default Home;