"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(value));
  };

  const handleSignup = async () => {
    if (!isValidEmail) return;

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${backend_url}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "burtgehd aldaа");
      } else {
        setMessage("🥳 Registration successful");
        setTimeout(
          () => router.push(`/createPass?email=${encodeURIComponent(email)}`),
          1500,
        );
      }
    } catch (err) {
      console.error(err);
      setMessage("serverin l error ym shigbn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col lg:flex-row justify-center lg:justify-around min-h-screen w-full items-center px-4 py-8 lg:py-0">
      <div className="bg-white w-full max-w-[416px] rounded-lg p-4 sm:p-6 flex flex-col justify-between order-2 lg:order-1">
        <div>
          <button
            className="border border-gray-400 w-9 h-9 rounded-lg text-center text-black cursor-pointer"
            onClick={() => router.back()}
          >
            ◀︎
          </button>

          <div className="flex flex-col gap-1 pt-4">
            <p className="text-black text-[20px] sm:text-[24px] font-semibold">
              Create your account
            </p>
            <p className="text-[#71717A] text-[14px] sm:text-[16px] font-normal">
              Sign up to explore your favorite dishes.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              className="border border-[#E4E4E7] w-full p-2 sm:p-3 rounded text-black text-[14px] sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
            />
            {!isValidEmail && email && (
              <p className="text-red-500 text-[12px] sm:text-[14px] font-medium -mt-2">
                Invalid email. Use a format like example@email.com
              </p>
            )}

            <button
              disabled={!isValidEmail || loading}
              onClick={handleSignup}
              className={`w-full h-10 sm:h-11 rounded-lg transition font-medium text-[14px] ${
                !isValidEmail || loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-black transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444] cursor-pointer"
              }`}
            >
              {loading ? "Please Wait..." : "Let's Go"}
            </button>

            {message && (
              <p
                className={`text-[12px] sm:text-[14px] font-medium mt-2 ${message.includes("🥳") ? "text-green-500" : "text-red-500"}`}
              >
                {message}
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-5 pt-2">
              <p className="text-[14px] sm:text-[16px] font-normal text-[#71717A]">
                Already have an account?
              </p>
              <p
                className="text-[14px] sm:text-[16px] font-normal text-[#2563EB] hover:underline cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Log in
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block order-1 lg:order-2">
        <img
          src="/login.jpg"
          className="w-full max-w-[500px] xl:max-w-[700px] 2xl:max-w-[900px] h-auto max-h-[80vh] rounded-lg object-cover"
          alt="login"
        />
      </div>
    </div>
  );
}
