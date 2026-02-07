"use client";
import { useState } from "react";
import { AddIcon, CorrectIcon } from "../../../icon";
import { useCart } from "../context/cartContext";

export const FoodCard = ({ image, name, price, description, _id }) => {
  const { addToCart } = useCart();
  const [showDetail, setShowDetail] = useState(false);
  const [count, setCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const handleAddToCart = () => {
    if (count > 0) {
      addToCart({ _id, name, price, quantity: count, image, description });

      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 2000);
      setShowDetail(false);
      setCount(0);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setCount(0);
          setShowDetail(true);
        }}
        className="w-full max-w-[379px] min-h-[280px] sm:min-h-[342px] bg-[#e9e9e4] rounded-2xl relative cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      >
        <div className="p-3 sm:p-4 relative">
          <img
            src={image}
            alt={name}
            className="rounded-[10px] w-full h-40 sm:h-[210px] object-cover"
          />
          <div className="absolute bottom-2 right-2 cursor-pointer hover:scale-105 transition">
            <AddIcon />
          </div>
        </div>
        <div className="flex justify-between px-3 sm:px-4 pt-1 sm:pt-2.5">
          <p className="text-[16px] sm:text-[20px] md:text-[24px] font-semibold text-[#EF4444] truncate flex-1">
            {name}
          </p>
          <p className="text-[14px] sm:text-[18px] font-semibold text-black ml-2">
            {price}
          </p>
        </div>
        <div className="flex justify-center pt-1 sm:pt-2.5 text-center px-3 pb-3">
          <p className="text-[12px] sm:text-[14px] font-normal text-[#09090B] line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[826px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative flex flex-col md:flex-row gap-4 md:gap-[30px]">
            <button
              onClick={() => setShowDetail(false)}
              className="absolute top-3 cursor-pointer right-3 sm:top-4 sm:right-4 bg-white border border-gray-400 hover:bg-gray-300 text-gray-700 font-bold rounded-full w-8 h-8 sm:w-[35px] sm:h-[35px] flex items-center justify-center transition z-10"
            >
              ✕
            </button>

            <div className="relative w-full md:w-[300px] lg:w-[377px] h-[200px] sm:h-[280px] md:h-[364px] shrink-0">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>

            <div className="flex flex-col justify-between flex-1">
              <div className="text-left mt-1 sm:mt-2.5">
                <h2 className="text-[20px] sm:text-[26px] md:text-[30px] font-semibold text-[#EF4444] mb-2">
                  {name}
                </h2>
                <p className="text-[13px] sm:text-[16px] font-normal text-[#09090B] leading-5 sm:leading-6">
                  {description}
                </p>
              </div>

              <div className="pt-4 sm:pt-[30px]">
                <div className="flex flex-col gap-4 sm:gap-[25px]">
                  <div className="flex justify-between sm:justify-around items-center">
                    <div>
                      <p className="text-[13px] sm:text-[16px] font-normal text-[#09090B]">
                        Total price
                      </p>
                      <p className="text-[18px] sm:text-[24px] font-semibold text-black">
                        {count > 0
                          ? `$${(
                              parseFloat(price.replace("$", "")) * count
                            ).toFixed(2)}`
                          : "$0.00"}
                      </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3 items-center">
                      <button
                        onClick={() => setCount(count > 0 ? count - 1 : 0)}
                        className="border cursor-pointer border-gray-400 text-black rounded-full w-9 h-9 sm:w-11 sm:h-11 hover:bg-gray-100 transition hover:text-[#ef4444] text-[16px] sm:text-[18px]"
                      >
                        −
                      </button>
                      <p className="text-black text-[16px] sm:text-[18px] font-semibold w-10 sm:w-15 text-center">
                        {count}
                      </p>
                      <button
                        onClick={() => setCount(count + 1)}
                        className="border cursor-pointer border-gray-400 text-black rounded-full w-9 h-9 sm:w-11 sm:h-11 hover:bg-gray-100 transition hover:text-[#ef4444] text-[16px] sm:text-[18px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 mt-4 sm:mt-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={count === 0}
                    className={`w-full text-white px-4 py-2 sm:py-3 rounded-[15px] font-medium text-[14px] sm:text-[16px] transition ${
                      count === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-[#EF4444] cursor-pointer hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotif && (
        <div className="fixed flex items-center gap-2 top-4 sm:top-[30px] left-1/2 -translate-x-1/2 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg animate-fadeIn z-9999 text-[12px] sm:text-[14px]">
          <CorrectIcon />
          Food is being added to the cart!
        </div>
      )}
    </>
  );
};
