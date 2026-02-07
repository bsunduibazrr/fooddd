"use client";
import { useEffect, useState } from "react";
import {
  DateIcon,
  DishIcon,
  Line,
  Location,
  LocationIcon,
  LogoCart,
  NomNom,
  ShoppingIcon,
  ShoppingIconnn,
  UserIcon,
} from "../../../icon";
import { useCart } from "../context/cartContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner, LoadingOverlay } from "../components/LoadingSpinner";

export const UserHeader = () => {
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState("");
  const [active, setActive] = useState("cart");
  const city = location.split(",")[location.split(",").length - 1]?.trim();
  const [showCheckoutNotif, setShowCheckoutNotif] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const locationInfo =
        JSON.parse(localStorage.getItem("locationInfo")) || {};

      const formattedAddress = [
        locationInfo.location,
        locationInfo.district && `${locationInfo.district} district`,
        locationInfo.subdistrict,
        locationInfo.details,
      ]
        .filter(Boolean)
        .join(" | ");

      setAddress(formattedAddress);
    }
  }, []);

  const {
    cartItems,
    addToCart,
    removeItem,
    incrementQty,
    decrementQty,
    clearCart,
    totalPrice,
    itemsTotal,
    shippingFee,
    totalItems,
  } = useCart();

  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) setUserEmail(email);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    router.push("/login");
  };

  const closeCart = () => setShowCartDropdown(false);

  const handleCheckout = async () => {
    const email = localStorage.getItem("email");

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const deliveryAddress =
      [district && `${district} district`, subdistrict, details]
        .filter(Boolean)
        .join(" | ") || "No address provided";

    const bodyData = {
      email,
      address: deliveryAddress,
      price: totalPrice,
      items: cartItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
      })),
    };

    setCheckoutLoading(true);
    try {
      const res = await fetch(`${backend_url}/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to place order");

      clearCart();
      setShowCheckoutNotif(true);

      setTimeout(() => {
        setShowCheckoutNotif(false);
        setShowCartDropdown(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    const storedLocationInfo = localStorage.getItem("locationInfo");
    if (storedLocationInfo) {
      const { location, district, subdistrict, details } =
        JSON.parse(storedLocationInfo);
      setLocation(location || "");
      setDistrict(district || "");
      setSubdistrict(subdistrict || "");
      setDetails(details || "");
    }
  }, []);

  useEffect(() => {
    const locationInfo = { location, district, subdistrict, details };
    localStorage.setItem("locationInfo", JSON.stringify(locationInfo));
  }, [location, district, subdistrict, details]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`${backend_url}/order?email=${email}`);
        const data = await res.json();

        console.log(data.orders);

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 md:px-[60px] pt-4 sm:pt-8 md:pt-[68px] relative gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <NomNom />
          <div className="flex flex-col">
            <p className="text-[18px] sm:text-[20px] font-semibold text-white">
              Sun<span className="text-[#EF4444]">Sun</span>
            </p>
            <p className="text-[10px] sm:text-[12px] font-normal">
              Swift Delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 relative">
          <div
            onClick={() => setShowLocationInput(true)}
            className="max-w-[150px] sm:max-w-[300px] cursor-pointer h-8 sm:h-9 rounded-[10px] bg-white flex justify-center items-center hover:bg-gray-100 transition px-2"
          >
            <div className="text-[11px] sm:text-[13px] font-normal flex items-center gap-1 sm:gap-2">
              <LocationIcon />
              {location || district || subdistrict || details ? (
                <div className="flex gap-1 sm:gap-2 items-center max-w-[100px] sm:max-w-[250px]">
                  <span className="text-black truncate text-[10px] sm:text-[13px]">
                    {[location, district && `${district}`, subdistrict]
                      .filter(Boolean)
                      .join(" | ")}{" "}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("");
                      setDistrict("");
                      setSubdistrict("");
                      setDetails("");
                      localStorage.removeItem("locationInfo");
                    }}
                    className="w-4 h-4 sm:w-5 sm:h-5 border border-[#EF4444] rounded-full cursor-pointer text-[#EF4444] text-[10px] sm:text-[12px] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="hidden sm:inline">
                  <span className="text-[#EF4444]">Delivery address:</span>
                  <span className="text-black">&nbsp;Add Location ►</span>
                </span>
              )}
              <span className="sm:hidden text-[#EF4444]">📍</span>
            </div>
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => setShowCartDropdown(true)}
          >
            <ShoppingIcon />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#EF4444] text-white text-[10px] sm:text-sm rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <UserIcon />
            {showUserDropdown && (
              <div className="absolute top-10 right-0 flex flex-col gap-2.5 justify-center items-center bg-white w-40 sm:w-[188px] h-[104px] rounded-[10px] shadow-lg p-3 sm:p-4 z-50 transition-all duration-300 animate-fadeIn pointer-events-auto">
                <p className="text-[12px] sm:text-[14px] font-semibold text-black truncate max-w-full">
                  {userEmail || "Guest"}
                </p>
                <button
                  onClick={handleSignOut}
                  className="w-24 sm:w-28 bg-[#f4f4f8] text-black flex items-center justify-center rounded-[5px] text-[12px] sm:text-[14px] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
                >
                  <span className="mr-2">Sign out</span>
                  <span className="transform translate-x-0 transition-transform duration-300 hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCartDropdown && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {showCartDropdown && (
        <div className="fixed inset-0 z-40" onClick={closeCart}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      <div
        className={`fixed top-0 right-0 w-full sm:w-[400px] md:w-[535px] h-full bg-[#404040] rounded-l-[10px] shadow-lg p-3 sm:p-4 z-50 flex flex-col gap-2 transform transition-transform duration-500 ease-in-out ${
          showCartDropdown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between pt-2 sm:pt-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShoppingIconnn />
            <p className="text-[16px] sm:text-[20px] font-semibold text-white">
              Order detail
            </p>
          </div>
          <button
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white text-center text-[14px] sm:text-[16px] cursor-pointer transition duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
            onClick={closeCart}
          >
            ✕
          </button>
        </div>

        <div className="flex pt-2 justify-center  bg-white h-9 sm:h-10 w-full max-w-[471px] rounded-[17px] items-center gap-2 sm:gap-3 pb-2 pl-0 mx-auto">
          <button
            onClick={() => setActive("cart")}
            className={`flex-1 max-w-[180px] cursor-pointer sm:max-w-[227px] rounded-[17px] h-7 sm:h-9 transition text-[13px] sm:text-[16px] ${
              active === "cart"
                ? "bg-[#EF4444] text-white"
                : "bg-white text-black"
            }`}
          >
            Cart
          </button>
          <button
            onClick={() => setActive("order")}
            className={`flex-1 max-w-[180px] cursor-pointer sm:max-w-[227px] rounded-[17px] py-2 h-7 sm:h-9 transition text-[13px] sm:text-[16px] ${
              active === "order"
                ? "bg-[#EF4444] text-white"
                : "bg-white text-black"
            }`}
          >
            Order
          </button>
        </div>

        <div className="pt-4 sm:pt-6 relative h-[400px] sm:h-[500px]">
          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              active === "cart"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-5 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-2xl w-full max-w-[471px] h-full sm:h-[600px] overflow-auto p-3 sm:p-5 mx-auto">
              {cartItems.length > 0 ? (
                <div>
                  <>
                    <p className="text-[16px] sm:text-[20px] font-semibold text-[#09090B] mb-3 sm:mb-4">
                      My Cart
                    </p>
                    {cartItems.map((item, index) => (
                      <div
                        key={item._id ? item._id : index}
                        className="flex justify-between py-2 gap-2"
                      >
                        <div className="w-20 h-20 sm:w-[124px] sm:h-[120px] rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1 px-2 sm:px-4 min-w-0">
                          <div>
                            <p className="text-[13px] sm:text-[16px] font-bold text-[#EF4444] truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] sm:text-[14px] text-gray-700 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-1 sm:pt-2">
                            <div className="flex gap-2 sm:gap-4">
                              <button
                                onClick={() => decrementQty(item._id)}
                                className="text-black text-[14px] sm:text-[18px] font-semibold cursor-pointer hover:text-[#ef4444]"
                              >
                                －
                              </button>
                              <p className="text-black text-[14px] sm:text-[18px] font-semibold">
                                {item.quantity}
                              </p>
                              <button
                                onClick={() => incrementQty(item._id)}
                                className="text-black text-[14px] sm:text-[18px] font-semibold cursor-pointer hover:text-[#ef4444]"
                              >
                                ＋
                              </button>
                            </div>
                            <p className="text-[13px] sm:text-[16px] font-bold text-black">
                              $
                              {(
                                item.quantity *
                                parseFloat(
                                  String(item.price || "0").replace(
                                    /[^0-9.]/g,
                                    "",
                                  ),
                                )
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <button
                            onClick={() => removeItem(item._id)}
                            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#EF4444] text-center text-[12px] sm:text-[16px] cursor-pointer text-[#EF4444] transition-all duration-300 hover:bg-[#ef4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                  <div className="pt-4">
                    <Line />
                  </div>
                  <div className="flex flex-col gap-2 pt-6">
                    <p className="text-[20px] font-semibold text-[#71717A]">
                      Delivery location
                    </p>
                    <textarea
                      value={[
                        location,
                        district && `${district} district`,
                        subdistrict,
                        details,
                      ]
                        .filter(Boolean)
                        .join(" | ")}
                      onChange={(e) => setDetails(e.target.value)}
                      className="border border-gray-400 rounded-lg h-20 p-3 text-black"
                      placeholder="Please share your complete address"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5 h-full">
                  <p className="text-[20px] font-semibold text-black">
                    My cart
                  </p>
                  <div className="flex flex-col gap-1 w-full items-center justify-center bg-[#f4f4f5] h-[182px] rounded-lg">
                    <LogoCart />
                    <p className="text-black text-[16px] font-bold">
                      Your cart is empty
                    </p>
                    <p className="text-[14px] font-normal text-[#71717A] text-center">
                      Hungry? 🍔 Add some delicious dishes to your cart and{" "}
                      <br />
                      satisfy your cravings!
                    </p>
                  </div>
                  <button
                    className="border border-[#EF4444] transition-all duration-300 w-full h-11 text-[#EF4444] text-[14px] font-medium rounded-[15px] cursor-pointer hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
                    onClick={closeCart}
                  >
                    Add Food
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              active === "order"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-5 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-2xl w-[471px] h-[600px] overflow-auto p-5 mx-auto">
              <p className="text-[20px] font-semibold text-black mb-4">
                Order History
              </p>
              {ordersLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <LoadingSpinner size="md" text="Loading orders..." />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <div
                    key={order.foodId ? order.foodId : index}
                    className="mb-6"
                  >
                    <div className="flex justify-between py-2">
                      <p className="text-[16px] font-bold text-black">
                        ${order.price}
                      </p>
                      <button className="rounded-lg border border-red-500 text-black text-center w-[68px]">
                        {order.status}
                      </button>
                    </div>
                    {order.foodOrderItem?.map((item, idx) => (
                      <div key={idx} className="pt-2 flex items-center gap-2">
                        {item.food?.image ? (
                          <img
                            src={item.food.image}
                            alt={item.food?.foodName}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        ) : (
                          <DishIcon />
                        )}
                        <p className="flex-1 text-[12px] font-medium text-black">
                          {item.food?.foodName || "Unknown"}
                        </p>
                        <p className="text-[#EF4444] text-[12px] font-semibold">
                          x{item.quantity}
                        </p>
                      </div>
                    ))}

                    <div className="pt-2 flex justify-between">
                      <p className="flex gap-1 text-[12px] font-normal text-[#71717A]">
                        <DateIcon />{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="pt-2 flex gap-1 items-center">
                      <Location />
                      <span className="text-[12px] font-normal text-[#71717A]">
                        {order.address}
                      </span>
                    </div>
                    <div className="pt-4">
                      <Line />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-1 w-full items-center justify-center bg-[#f4f4f5] h-[182px] rounded-lg">
                  <LogoCart />
                  <p className="text-black text-[16px] font-bold">
                    No Orders Yet?
                  </p>
                  <p className="text-[14px] font-normal text-[#71717A] text-center">
                    🍕 "You haven't placed any orders yet. Start exploring our
                    menu and satisfy your cravings!"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2 sm:pt-4">
          <div className="bg-white w-full max-w-[471px] rounded-lg p-3 sm:p-5 mx-auto">
            <div className="pt-2 sm:pt-3">
              <p className="text-[16px] sm:text-[20px] font-semibold text-black">
                Payment info
              </p>
              <div className="flex justify-between pt-2 sm:pt-4">
                <p className="text-[13px] sm:text-[16px] font-normal text-[#71717A]">
                  Items
                </p>
                <p className="text-[16px] sm:text-[20px] font-semibold text-black">
                  ${itemsTotal}
                </p>
              </div>
              <div className="flex justify-between pt-1">
                <p className="text-[13px] sm:text-[16px] font-normal text-[#71717A]">
                  Shipping
                </p>
                <p className="text-[16px] sm:text-[20px] font-semibold text-black">
                  ${shippingFee}
                </p>
              </div>
              <div className="pt-2 sm:pt-4">
                <Line />
              </div>
              <div className="flex justify-between pt-3 sm:pt-5">
                <p className="text-[14px] sm:text-[16px] font-normal text-[#71717A]">
                  Total
                </p>
                <p className="text-[18px] sm:text-[20px] font-semibold text-black">
                  {" "}
                  ${itemsTotal + shippingFee}
                </p>
              </div>
              <button
                disabled={cartItems.length === 0 || checkoutLoading}
                onClick={handleCheckout}
                className={`w-full h-10 sm:h-11 mt-4 sm:mt-6 rounded-[15px] text-white text-[14px] sm:text-[16px] cursor-pointer flex items-center justify-center gap-2 ${
                  cartItems.length > 0 && !checkoutLoading
                    ? "bg-[#EF4444]"
                    : "bg-red-100 cursor-not-allowed"
                }`}
              >
                {checkoutLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLocationInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-8 rounded-lg w-full max-w-[502px] relative flex flex-col gap-4 sm:gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between gap-1">
              <p className="text-[18px] sm:text-[24px] font-semibold text-black">
                Add location info
              </p>
              <button
                onClick={() => setShowLocationInput(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer bg-[#F4F4F5] rounded-full text-black text-[12px] sm:text-[14px] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                  <p className="text-[16px] font-semibold text-black">
                    District
                  </p>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-9 border pl-3 text-black rounded-lg border-[#E4E4E7] cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="Bayanzurkh">Bayanzurkh</option>
                    <option value="Sukhbaatar">Sukhbaatar</option>
                    <option value="Bayangol">Bayangol</option>
                    <option value="Khan-Uul">Khan-Uul</option>
                    <option value="SonginoKhairkhan">SonginoKhairkhan</option>
                    <option value="Chingeltei">Chingeltei</option>
                    <option value="Baganuur">Baganuur</option>
                    <option value="Nalaikh">Nalaikh</option>
                    <option value="BagaKhangai">BagaKhangai</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                  <p className="text-[16px] font-semibold text-black">
                    Subdistrict
                  </p>
                  <select
                    value={subdistrict}
                    onChange={(e) => setSubdistrict(e.target.value)}
                    className="w-full h-9 border pl-3 text-black rounded-lg border-[#E4E4E7] cursor-pointer"
                  >
                    <option value="">Select</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={`${i + 1}-th khoroo`}>
                        {i + 1}-th khoroo
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[16px] font-semibold text-black">
                  Detailed Address
                </p>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full h-[90px] border pl-5 pt-2 text-black rounded-lg border-[#E4E4E7]"
                  placeholder="Building, entrance, apartment number..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pb-5">
              <button
                onClick={() => setShowLocationInput(false)}
                className="cursor-pointer text-black border border-[#e4e4e7] rounded-lg w-[79px] bg-white h-10 mt-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const locationInfo = {
                    location,
                    district,
                    subdistrict,
                    details,
                  };
                  localStorage.setItem(
                    "locationInfo",
                    JSON.stringify(locationInfo),
                  );
                  setShowLocationInput(false);
                }}
                className="cursor-pointer bg-black text-white rounded-lg w-[115px] h-10 mt-4"
              >
                Deliver Here
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutLoading && <LoadingOverlay text="Placing your order..." />}

      {showCheckoutNotif && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999">
          <div className="fixed top-[30%] right-[50%] w-[664px] h-[439px] translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn flex justify-center items-center">
            <div className="pt-6 flex flex-col gap-6">
              <p className="text-[24px] font-semibold text-black">
                Your order has been successfully placed!
              </p>
              <div className="flex justify-center">
                <img className="w-[156px] h-[265px]" src="child.png" />
              </div>
              <div className="flex justify-center pb-6">
                <button
                  onClick={() => setShowCheckoutNotif(false)}
                  className="rounded-[15px] bg-[#F4F4F5] text-center cursor-pointer w-[188px] h-11 transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
                >
                  <p className="text-[14px] font-medium ">Back To Home</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <img src="BG.png" className="pt-2.5" />
    </div>
  );
};
