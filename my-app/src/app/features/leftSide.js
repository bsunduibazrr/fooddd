"use client";
import { ActiveFoodMenu, FoodMenu, NomNom, Porter } from "../../../icon";
import { UnactivePorter } from "../../../icon";

export const LeftSide = ({ activePage, setActivePage }) => {
  return (
    <div className="hidden md:flex shrink-0">
      <div className="w-[220px] lg:w-[305px] min-h-screen bg-white border-r border-gray-200">
        <div className="flex gap-2 lg:gap-[9px] justify-center pt-6 lg:pt-9">
          <div className="scale-75 lg:scale-100">
            <NomNom />
          </div>
          <div className="flex flex-col justify-center">
            <div>
              <p className="text-[16px] lg:text-[18px] font-bold text-black">
                SunSun
              </p>
            </div>
            <div>
              <p className="text-[10px] lg:text-[12px] font-normal text-[#71717A]">
                Swift delivery
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setActivePage("food")}
          className="flex justify-center cursor-pointer pt-8 lg:pt-10"
        >
          <div
            className={`flex gap-2 lg:gap-2.5 px-3 lg:px-4 py-2 rounded-[30px] items-center transition-all duration-200 ${
              activePage === "food" ? "bg-[#18181B]" : "hover:bg-gray-100"
            }`}
          >
            {activePage === "food" ? <ActiveFoodMenu /> : <FoodMenu />}
            <p
              className={`text-[12px] lg:text-[14px] font-medium ${
                activePage === "food" ? "text-white" : "text-[#09090B]"
              }`}
            >
              Food Menu
            </p>
          </div>
        </div>

        <div
          onClick={() => setActivePage("orders")}
          className="flex justify-center pt-4 lg:pt-6 cursor-pointer"
        >
          <div
            className={`w-[140px] lg:w-[165px] h-9 lg:h-10 rounded-[30px] flex gap-2 lg:gap-3 justify-center items-center transition-all duration-200 ${
              activePage === "orders"
                ? "bg-[#18181B] text-white"
                : "text-[#09090B] hover:bg-gray-100"
            }`}
          >
            {activePage === "orders" ? <Porter /> : <UnactivePorter />}
            <p className="text-[12px] lg:text-[14px] font-medium">Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};
