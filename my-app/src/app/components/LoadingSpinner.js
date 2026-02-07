"use client";

export const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-[#EF4444] animate-spin"></div>
      </div>
      {text && (
        <p className="text-[14px] font-medium text-gray-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="w-[379px] min-h-[342px] bg-gray-200 rounded-2xl animate-pulse">
      <div className="p-2">
        <div className="rounded-[10px] w-[365px] h-[210px] bg-gray-300"></div>
      </div>
      <div className="flex justify-center pt-2.5 px-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-5 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="flex justify-start pt-2.5 ">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export const LoadingPage = ({ text = "Loading data..." }) => {
  return (
    <div className="flex items-center justify-center w-full h-[400px]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export const LoadingOverlay = ({ text = "Please wait..." }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#EF4444] animate-spin"></div>
        </div>
        <p className="text-[16px] font-medium text-black">{text}</p>
      </div>
    </div>
  );
};
