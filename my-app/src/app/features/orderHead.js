import { CheckBox, Dropdown } from "../../../icon";

export const OrderHead = () => {
  return (
    <div className="pt-4 sm:pt-6 lg:pt-10">
      <div className="min-w-[900px] lg:w-[1171px] h-12 sm:h-14 bg-[#E4E4E7] flex items-center">
        <div className="flex items-center w-full px-2 sm:px-4">
          <div className="w-10 sm:w-14 flex justify-center">
            <CheckBox />
          </div>
          <p className="text-[12px] sm:text-[14px] w-10 sm:w-14 font-normal text-black">
            #
          </p>
          <p className="text-[12px] sm:text-[14px] font-medium w-[140px] sm:w-[214px] text-[#71717A]">
            Customer
          </p>
          <p className="text-[12px] sm:text-[14px] font-medium w-20 sm:w-40 text-[#71717A]">
            Food
          </p>
          <p className="text-[12px] sm:text-[14px] font-medium w-20 sm:w-40 text-[#71717A]">
            Date
          </p>
          <p className="text-[12px] sm:text-[14px] font-medium w-20 sm:w-40 text-[#71717A]">
            Price
          </p>
          <p className="text-[12px] sm:text-[14px] font-medium w-[120px] sm:w-[194px] text-[#71717A]">
            Address
          </p>
          <p className="text-[12px] sm:text-[14px] font-medium text-[#71717A] flex gap-1 items-center">
            State <Dropdown />
          </p>
        </div>
      </div>
    </div>
  );
};
