
import ICON1 from "../../../assets/icon1.svg"
import ICON2 from "../../../assets/icon2.svg"
import ICON3 from "../../../assets/icon3.svg"

const Menu = () => {

    const items = [
        { name: "Breakfast", desc: "In the new era of technology we look in the future with certainty and pride for our life.", img: ICON1 },
        { name: 'Lunch', desc: "In the new era of technology we look in the future with certainty and pride for our life.", img: ICON2 },
        { name: "Snacks", desc: "In the new era of technology we look in the future with certainty and pride for our life.", img: ICON3 }
    ]

    return (
        <div>
            <h1 className="font-playfair text-[50px] text-center">Browse Our Menu</h1>
            <div className="grid grid-cols-3 gap-2 mt-5">
                {
                    items.map((item)=>(
                        <div className="border border-gray-200 shadow-2xl rounded-2xl py-10 px-8 flex flex-col gap-5 items-center">
                            <img src={item.img} alt="category" />
                            <h1 className="font-bold text-[20px] font-Poppins">{item.name}</h1>
                            <p className="font-Poppins font-thin text-center">{item.desc}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Menu
