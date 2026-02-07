"use client";
import { useState } from "react";
import { LeftSide } from "../features/leftSide";
import FoodMenuPage from "../foodMenu/page";
import OrderInfo from "../features/order/page";
import { NomNom } from "../../../icon";

export default function Page() {
  const [activePage, setActivePage] = useState("orders");

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#f4f4f5]">
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="scale-75">
            <NomNom />
          </div>
          <p className="text-[16px] font-bold text-black">SunSun Admin</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActivePage("food")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition ${
              activePage === "food"
                ? "bg-[#18181B] text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActivePage("orders")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition ${
              activePage === "orders"
                ? "bg-[#18181B] text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      <LeftSide activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 overflow-y-auto">
        {activePage === "food" && <FoodMenuPage />}
        {activePage === "orders" && <OrderInfo />}
      </div>
    </div>
  );
}
