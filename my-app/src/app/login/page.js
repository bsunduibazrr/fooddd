"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const passwordRef = useRef(null);
  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(value));
  };

  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setErrorMessage("");

    console.log(backend_url, "backendurl");

    try {
      const res = await fetch(`${backend_url}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Newtrhed alda garsn");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      const decoded = jwtDecode(data.token);

      if (decoded.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("backend url hoosn");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && isValidEmail;

  return (
    <div className="bg-white flex flex-col lg:flex-row justify-center lg:justify-around min-h-screen w-full items-center px-4 py-8 lg:py-0">
      <div className="bg-white w-full max-w-[416px] rounded-lg p-4 sm:p-6 order-2 lg:order-1">
        <button
          onClick={() => router.back()}
          className="border border-gray-400 w-9 h-9 rounded-lg text-center text-black cursor-pointer"
        >
          ◀︎
        </button>

        <div className="flex flex-col gap-1 pt-4">
          <p className="text-black text-[20px] sm:text-[24px] font-semibold">
            Log in
          </p>
          <p className="text-[#71717A] text-[14px] sm:text-[16px] font-normal">
            Log in to enjoy your favorite dishes.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 pt-6">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                passwordRef.current?.focus();
              }
            }}
            className="border border-[#E4E4E7] w-full p-2 sm:p-3 rounded text-black text-[14px] sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
          />
          {email && !isValidEmail && (
            <p className="text-red-500 text-[12px] sm:text-[14px] font-medium -mt-3">
              Invalid email format.
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isFormValid) {
                  handleLogin();
                }
              }}
              className="border border-[#E4E4E7] w-full p-2 sm:p-3 rounded text-black text-[14px] sm:text-[16px] focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 sm:top-3.5 text-gray-500 text-sm cursor-pointer select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <p
            className="text-[13px] sm:text-[14px] font-normal hover:underline text-black cursor-pointer"
            onClick={() => router.push("/resetPassword")}
          >
            Forgot password?
          </p>

          {errorMessage && (
            <p className="text-red-500 text-[12px] sm:text-[14px] font-medium">
              {errorMessage}
            </p>
          )}

          <button
            disabled={!isFormValid || loading}
            onClick={handleLogin}
            className={`w-full h-10 sm:h-11 rounded-lg transition font-medium text-[14px] ${
              !isFormValid || loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-black cursor-pointer transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444]"
            }`}
          >
            {loading ? "Logging in..." : "Let's Go"}
          </button>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-5">
            <p className="text-[14px] sm:text-[16px] font-normal text-[#71717A]">
              Don't have an account?
            </p>
            <p
              className="text-[14px] sm:text-[16px] font-normal text-[#2563EB] hover:underline cursor-pointer"
              onClick={() => {
                setEmail("");
                setPassword("");
                setIsValidEmail(false);
                setErrorMessage("");
                router.push("/signup");
              }}
            >
              Sign up
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block order-1 lg:order-2">
        <img
          src="/login.jpg"
          className="w-full max-w-[500px] xl:max-w-[700px] 2xl:max-w-[900px] h-auto max-h-[80vh] rounded-lg object-cover"
        />
      </div>
    </div>
  );
}
