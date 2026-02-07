"use client";
import { useState } from "react";
import { Dropdown } from "../../../icon";

export const OrderComponent = ({
  id,
  number,
  email,
  foodLength,
  date,
  price,
  address,
  states,
  foodOrderItem = [],
  selected,
  onSelect,
  onStateChange,
}) => {
  const [currentState, setCurrentState] = useState(states || "Pending");
  const [showDropdown, setShowDropdown] = useState(false);
  const [openFoods, setOpenFoods] = useState(false);
  const [foodPosition, setFoodPosition] = useState({ top: 0, left: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  const borderColor =
    currentState === "Pending"
      ? "border-[#EF4444]"
      : currentState === "Delivered"
        ? "border-green-500"
        : currentState === "Cancelled"
          ? "border-gray-300"
          : "border-gray-300";

  const stateOptions = ["Pending", "Delivered", "Cancelled"];

  const handleSelectState = async (state) => {
    if (state === currentState) {
      setShowDropdown(false);
      return;
    }

    const previousState = currentState;
    setCurrentState(state);
    setShowDropdown(false);

    try {
      setIsUpdating(true);
      const res = await fetch(`${backend_url}/order/update-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: [id], status: state }),
      });

      if (!res.ok) {
        setCurrentState(previousState);
        const text = await res.text();
        console.error("Serverin aldashu:", text);
      } else {
        const data = await res.json();
        onStateChange?.(id, state);
      }
    } catch (err) {
      setCurrentState(previousState);
      console.error("serverih :", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const safeOnSelect = onSelect || (() => {});

  return (
    <>
      <div
        className={`min-w-[900px] lg:w-[1171px] h-12 sm:h-14 bg-[#F4F4F5] flex items-center transition-all duration-300 border-l-4 ${borderColor}`}
      >
        <div className="flex items-center w-full px-2 sm:px-4">
          <div className="w-10 sm:w-14 flex justify-center">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => safeOnSelect(id)}
              className="w-4 h-4 accent-black"
            />
          </div>

          <p className="text-[12px] sm:text-[14px] w-10 sm:w-14 font-normal text-black">
            {number}
          </p>

          <p className="text-[12px] sm:text-[14px] w-[140px] sm:w-[214px] font-medium text-[#71717A] truncate">
            {email}
          </p>

          <div
            className="text-[12px] sm:text-[14px] w-20 sm:w-40 flex gap-2 sm:gap-3 items-center font-medium text-[#71717A] cursor-pointer hover:text-black transition"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setFoodPosition({
                top: rect.bottom + window.scrollY - 70,
                left: Math.max(rect.left + window.scrollX - 150, 10),
              });
              setOpenFoods(!openFoods);
            }}
          >
            {foodLength}
            <div
              className={`${openFoods ? "rotate-180" : ""} transition-transform`}
            >
              <Dropdown />
            </div>
          </div>

          <p className="text-[12px] sm:text-[14px] w-20 sm:w-40 font-medium text-[#71717A]">
            {date}
          </p>

          <p className="text-[12px] sm:text-[14px] w-20 sm:w-40 font-medium text-[#71717A]">
            {price}
          </p>

          <div className="w-[120px] sm:w-[194px] overflow-hidden">
            <p className="text-[12px] sm:text-[14px] font-medium text-[#71717A] truncate">
              {address}
            </p>
          </div>

          <div className="relative">
            <div
              onClick={() => !isUpdating && setShowDropdown(!showDropdown)}
              className={`w-[90px] sm:w-[120px] h-[26px] sm:h-[30px] border-2 ${borderColor} rounded-[14px] flex justify-between cursor-pointer items-center px-2 text-[11px] sm:text-[14px] text-black font-medium transition ${
                isUpdating ? " cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              <span className="truncate">
                {isUpdating ? "Updating..." : currentState}
              </span>
              <Dropdown />
            </div>

            {showDropdown && !isUpdating && (
              <div className="absolute top-8 sm:top-10 left-0 w-[90px] sm:w-[120px] border-2 border-gray-300 rounded-lg shadow-lg z-9999 bg-white">
                {stateOptions.map((state) => {
                  let bgColor = "";
                  let textColor = "";

                  if (state === "Pending") {
                    bgColor = "bg-red-50";
                    textColor = "text-[#ef4444]";
                  }
                  if (state === "Delivered") {
                    bgColor = "bg-green-50";
                    textColor = "text-green-600";
                  }
                  if (state === "Cancelled") {
                    bgColor = "bg-gray-50";
                    textColor = "text-gray-700";
                  }

                  return (
                    <div
                      key={state}
                      onClick={() => handleSelectState(state)}
                      className={`px-3 py-2 bg-white text-[11px] sm:text-[13px] cursor-pointer text-center ${bgColor} ${textColor} hover:brightness-90 transition border-b last:border-b-0 font-medium`}
                    >
                      {state}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="min-w-[900px] lg:w-[1171px] h-px bg-gray-300"></div>

      {openFoods && (
        <div
          className="bg-white p-4 border-2 border-gray-300 rounded-xl shadow-2xl animate-fadeIn z-40 min-w-[300px]"
          style={{
            position: "fixed",
            top: `${foodPosition.top}px`,
            left: `${foodPosition.left}px`,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <p className="text-[16px] font-bold text-black">Order Items</p>
            <button
              onClick={() => setOpenFoods(false)}
              className="text-gray-400 hover:text-black text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {foodOrderItem.length > 0 ? (
            <div className="flex flex-col gap-3">
              {foodOrderItem.map((item, idx) => (
                <div
                  key={item.food?._id || item._id || idx}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  {item.food?.image ? (
                    <img
                      src={item.food.image}
                      alt={item.food?.foodName || "Food"}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-medium shrink-0">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#EF4444] truncate">
                      {item.food?.foodName || "Unknown Food"}
                    </p>
                    <p className="text-[12px] text-gray-500">
                      ${(item.food?.price || 0).toFixed(2)} each
                    </p>
                  </div>

                  <div className="bg-black text-white px-3 py-1 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0">
                    ×{item.quantity || 0}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No items in this order
            </p>
          )}
        </div>
      )}

      {openFoods && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenFoods(false)}
        />
      )}
    </>
  );
};
