"use client";
import { useEffect, useState } from "react";

import { Pagination } from "../pagination";
import { Calendar } from "../../../../icon";
import { OrderHead } from "../orderHead";
import { OrderComponent } from "@/app/components/orderComponent";
import ProFeature from "../pro";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function OrderInfo() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempState, setTempState] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const states = ["Pending", "Delivered", "Cancelled"];

  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  useEffect(() => {
    const savedStart = localStorage.getItem("startDate");
    const savedEnd = localStorage.getItem("endDate");
    if (savedStart) setStartDate(savedStart);
    if (savedEnd) setEndDate(savedEnd);
  }, []);

  const applyFilter = () => {
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);

    setShowDateModal(false);

    fetchOrders();
  };

  const handleSaveState = async () => {
    if (!tempState) return;

    try {
      await fetch(`${backend_url}/order/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          status: tempState,
        }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order._id)
            ? { ...order, status: tempState }
            : order,
        ),
      );

      setSelectedOrders([]);
      setDropdownOpen(false);
      setTempState("");
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = new URL(`${backend_url}/order/all`);

      url.searchParams.append("page", page);
      url.searchParams.append("limit", 15);

      if (startDate) url.searchParams.append("startDate", startDate);
      if (endDate) url.searchParams.append("endDate", endDate);

      const res = await fetch(url);
      const data = await res.json();

      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, startDate, endDate]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedOrders");
    if (saved) {
      setSelectedOrders(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedOrders", JSON.stringify(selectedOrders));
  }, [selectedOrders]);

  return (
    <div className="w-full h-full bg-[#f4f4f5] overflow-hidden pb-6">
      <div className="flex justify-end px-4 sm:px-6 pt-4 sm:pt-6">
        <ProFeature />
      </div>

      <div className="pt-4 sm:pt-8 flex justify-center px-2 sm:px-4 ">
        <div className="w-full max-w-[1171px] bg-white rounded-[10px] overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 p-4 sm:pt-6 sm:px-5">
            <div className="flex flex-col">
              <p className="text-[16px] sm:text-[20px] font-semibold text-black">
                Orders
              </p>
              <p className="text-[11px] sm:text-[12px] font-medium text-[#71717A]">
                {orders.length} items
              </p>
            </div>

            <div className="flex flex-col items-center sm:flex-row gap-2">
              <div className="flex gap-2 sm:gap-3 items-center">
                <button
                  onClick={() => setShowDateModal(true)}
                  className="flex-1 cursor-pointer sm:flex-none sm:min-w-[200px] h-9 sm:h-10 bg-white border border-gray-300 rounded-[10px] flex items-center justify-center gap-2 px-2 sm:px-3 text-black hover:bg-gray-100 transition text-[12px] sm:text-[14px]"
                >
                  <Calendar />

                  {startDate && endDate ? (
                    <span className="truncate">
                      {startDate} → {endDate}
                    </span>
                  ) : (
                    <span className="text-gray-500">Select Date</span>
                  )}
                </button>

                {showDateModal && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
                    <div className="bg-white w-[90%] max-w-[400px] p-6 rounded-2xl shadow-xl relative">
                      <h2 className="text-[18px] font-semibold text-black mb-5">
                        Select Date Range
                      </h2>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <label className="text-[13px] text-gray-500 mb-1">
                            From
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border text-black cursor-pointer border-gray-300 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[13px] text-gray-500 mb-1">
                            To
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border text-black cursor-pointer border-gray-300 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => {
                            setStartDate("");
                            setEndDate("");
                            localStorage.removeItem("startDate");
                            localStorage.removeItem("endDate");
                          }}
                          className="px-4 py-2 rounded-lg border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-100 transition"
                        >
                          Clear
                        </button>

                        <button
                          onClick={() => {
                            applyFilter();
                            setShowDateModal(false);
                          }}
                          className="px-6 py-2 rounded-lg bg-black text-white transition-all duration-300   text-[14px] font-medium  cursor-pointer hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
                        >
                          Apply
                        </button>
                      </div>

                      <button
                        onClick={() => setShowDateModal(false)}
                        className="absolute cursor-pointer top-3 right-3 bg-gray-200 w-8 h-8 rounded-full
                   flex items-center justify-center text-gray-700 hover:bg-gray-300 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`w-full sm:w-auto sm:min-w-[179px] h-8 sm:h-9 rounded-[15px] flex justify-center items-center cursor-pointer px-3 sm:px-4 gap-2 text-[12px] sm:text-[14px] ${
                  selectedOrders.length > 0
                    ? "bg-[#18181B] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (selectedOrders.length > 0) setDropdownOpen(true);
                }}
              >
                <span>Change delivery state</span>
                {selectedOrders.length > 0 && (
                  <span className="text-[11px] sm:text-[13px] bg-white text-black rounded-full px-2 py-px font-semibold">
                    {selectedOrders.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <OrderHead />

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="lg" text="Loading orders..." />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  No orders found
                </div>
              ) : (
                orders.map((order, i) => (
                  <OrderComponent
                    key={order._id}
                    id={order._id}
                    selected={selectedOrders.includes(order._id)}
                    number={(page - 1) * 15 + i + 1}
                    email={order.email}
                    foodLength={
                      Array.isArray(order.foodOrderItem)
                        ? order.foodOrderItem.reduce(
                            (sum, item) => sum + (item.quantity || 0),
                            0,
                          )
                        : 0
                    }
                    date={new Date(order.createdAt).toLocaleDateString()}
                    price={`$${order.price}`}
                    address={order.address || "No Address"}
                    states={order.status}
                    foodOrderItem={order.foodOrderItem || []}
                    onSelect={(id) =>
                      setSelectedOrders((prev) =>
                        prev.includes(id)
                          ? prev.filter((i) => i !== id)
                          : [...prev, id],
                      )
                    }
                    onStateChange={(id, newState) => {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o._id === id ? { ...o, status: newState } : o,
                        ),
                      );
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end px-4 sm:pr-[100px] pt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
      {dropdownOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg w-[90%] max-w-[400px] shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[16px] font-semibold text-black">
                Change Delivery State
              </h2>

              <button
                onClick={() => setDropdownOpen(false)}
                className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 font-bold rounded-full w-[35px] h-[35px] flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => setTempState(state)}
                  className={`px-4 py-3 rounded-[15px] cursor-pointer text-[16px] font-medium w-[100px] h-8 flex items-center justify-center transition ${
                    tempState === state
                      ? "bg-red-100 text-red-500 border border-red-400"
                      : "bg-gray-100 hover:bg-gray-200 text-black"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>

            <div className="pt-8 flex justify-center">
              <button
                onClick={handleSaveState}
                className="w-full bg-black text-white cursor-pointer rounded-[15px] h-9"
              >
                <p className="text-[14px] font-medium">Save</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
