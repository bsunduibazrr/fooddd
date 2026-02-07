import { useRef, useState } from "react";

export default function ProFeature() {
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState("pro.jpg");

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImg(imageUrl);
    }
  };

  return (
    <div className="flex justify-end">
      <div>
        <img
          src={profileImg}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer object-cover"
          onClick={handleImageClick}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
}
