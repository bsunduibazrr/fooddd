"use client";

import { useState, useEffect, useRef } from "react";
import { FoodCard } from "../components/foodCardComponent";
import { LoadingSpinner, LoadingCard } from "../components/LoadingSpinner";

export const UserBody = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  console.log("Backend URL:", backend_url);

  const handleCategoryClick = (index, id) => {
    setActiveIndex(index);
    scrollToCategory(id);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % categories.length;
    setActiveIndex(nextIndex);
    scrollToCategory(categories[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + categories.length) % categories.length;
    setActiveIndex(prevIndex);
    scrollToCategory(categories[prevIndex].id);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching foods from:", `${backend_url}/foods`);

      const res = await fetch(`${backend_url}/foods`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched foods data:", data);

      const foodsArray = Array.isArray(data) ? data : data.foods || [];
      console.log("Foods array:", foodsArray);

      setFoods(foodsArray);
    } catch (err) {
      console.error("❌ Error fetching foods:", err);
      setError(err.message);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCategories([
      { title: "Appetizers", id: "690ac3d4e762b2dc267f2f48" },
      { title: "Salads", id: "690ac407e762b2dc267f2f50" },
      { title: "Pizzas", id: "690ac3efe762b2dc267f2f4a" },
      { title: "Main Dishes", id: "690ac3f7e762b2dc267f2f4c" },
      { title: "Side Dishes", id: "690ac458e762b2dc267f2f5c" },
      { title: "Coffees", id: "690ac44ee762b2dc267f2f5a" },
      { title: "Brunch", id: "690ac440e762b2dc267f2f58" },
      { title: "Lunch Favs", id: "690ac3ffe762b2dc267f2f4e" },
      { title: "Desserts", id: "690ac40ee762b2dc267f2f54" },
      { title: "Fish & Sea Foods", id: "690ac435e762b2dc267f2f56" },
      { title: "Alchohol", id: "6912c5acb31f946c14c98393" },
      { title: "Juice", id: "6912e8775eb8a7e825728bfe" },
      { title: "Vegetarian", id: "691543273de6738098b8aca7" },
      { title: "Mongolian Traditional", id: "6916b3748467e6485b804d4b" },
      { title: "Chef's Specials", id: "6916b56f8467e6485b804e31" },
      { title: "Beer", id: "6916b7ca8467e6485b805037" },
      { title: "Cake", id: "6916bb238467e6485b805231" },
      { title: "Set Foods", id: "6916bf3b8467e6485b8052cd" },
    ]);
  }, []);

  const scrollToCategory = (id) => {
    const section = categoryRefs.current[id];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <div className="bg-[#404040] h-auto min-h-screen">
      <div className="flex gap-2 sm:gap-4 md:gap-6 flex-wrap p-3 sm:p-5 sticky top-0 bg-[#404040] z-20 justify-center items-center">
        <button
          onClick={handlePrev}
          className="px-2 py-1 sm:px-3 sm:py-2 bg-white text-black rounded-md shadow cursor-pointer text-[12px] sm:text-[16px] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
        >
          ◀︎
        </button>

        <div className="w-[70%] sm:w-[80%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-x-auto whitespace-nowrap flex gap-2 sm:gap-3 py-2">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(index, cat.id)}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-[10px] font-medium shadow-md transition-all duration-300 cursor-pointer text-[11px] sm:text-[14px] shrink-0
      ${
        activeIndex === index
          ? "bg-[#EF4444] text-white scale-105 shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
          : "bg-white text-black hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
      }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-2 py-1 sm:px-3 sm:py-2 bg-white text-black cursor-pointer rounded-md shadow text-[12px] sm:text-[16px] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
        >
          ►
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-20">
          <LoadingSpinner size="lg" text="Loading delicious foods..." />
          <div className="grid pt-6 sm:pt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-[30px] lg:gap-9 px-4 sm:px-5 md:px-10 lg:px-[60px]">
            {[1, 2, 3, 4].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-20">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
            <p className="text-red-400 font-semibold mb-2">
              Error loading foods:
            </p>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={fetchFoods}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && foods.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-20">
          <p className="text-gray-400 text-lg">No foods available</p>
        </div>
      )}

      {!loading &&
        !error &&
        foods.length > 0 &&
        categories.map((cat) => {
          const foodsInCat = foods.filter((f) => {
            const foodCategoryId = f.category?._id || f.categoryId;
            return foodCategoryId === cat.id;
          });

          if (foodsInCat.length === 0) return null;

          return (
            <div
              key={cat.id}
              ref={(el) => (categoryRefs.current[cat.id] = el)}
              id={cat.title.replace(/\s+/g, "-")}
            >
              <div className="flex pt-6 sm:pt-[38px] pl-4 sm:pl-8 md:pl-[88px]">
                <p className="text-[20px] sm:text-[26px] md:text-[30px] font-semibold text-white">
                  {cat.title} ({foodsInCat.length})
                </p>
              </div>

              <div className="grid pt-4 sm:pt-[30px] pb-8 sm:pb-[50px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-5 md:px-10 lg:px-[60px] gap-4 sm:gap-6 md:gap-[30px] lg:gap-9 justify-items-center">
                {foodsInCat.map((food) => (
                  <FoodCard
                    key={food._id}
                    _id={food._id}
                    name={food.foodName}
                    price={`$${food.price}`}
                    description={food.ingredients || food.description}
                    image={
                      food.image ||
                      "https://cpng.pikpng.com/pngl/s/106-1069399_iam-add-group1-sorry-no-image-available-clipart.png"
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};
