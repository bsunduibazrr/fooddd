"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreatePassForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const backend_url =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://fooddd-228k.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleCreatePassword = async () => {
    if (!password) return setMessage("Enter a password");
    if (password.length < 6)
      return setMessage("Password must be at least 6 characters");
    if (!confirmPassword) return setMessage("Confirm your password");
    if (password !== confirmPassword)
      return setMessage("Passwords don't match");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backend_url}/users/createPass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create password");
      } else {
        setMessage("🎉 Password created successfully!");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex justify-around h-screen w-full items-center">
      <div className="bg-white w-[416px] h-[500px] rounded-lg p-6 flex flex-col justify-between">
        <div>
          <button
            className="border border-gray-400 w-9 h-9 rounded-lg text-center text-black cursor-pointer"
            onClick={() => router.back()}
          >
            ◀︎
          </button>

          <div className="flex flex-col gap-1 pt-4">
            <p className="text-black text-[24px] font-semibold">
              Create your password
            </p>
            <p className="text-[#71717A] text-[16px] font-normal">
              Set a secure password for {email || "your account"}
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#E4E4E7] w-full p-2 rounded text-black focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePassword();
                }}
                className="border border-[#E4E4E7] w-full p-2 rounded text-black focus:outline-none focus:ring-1 focus:ring-[#EF4444]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 cursor-pointer"
              />
              <label className="text-[14px] text-[#71717A]">
                Show password
              </label>
            </div>

            {message && (
              <p
                className={`text-[14px] font-medium ${message.includes("🎉") ? "text-green-500" : "text-red-500"}`}
              >
                {message}
              </p>
            )}

            <button
              disabled={loading || !password || !confirmPassword}
              onClick={handleCreatePassword}
              className={`w-full h-9 rounded-lg transition font-medium text-[14px] ${
                loading || !password || !confirmPassword
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-black transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:scale-105 hover:shadow-[0_0_10px_#EF4444,0_0_20px_#EF4444,0_0_30px_#EF4444] cursor-pointer"
              }`}
            >
              {loading ? "Creating..." : "Create Password"}
            </button>

            <div className="flex justify-center gap-5 pt-2">
              <p className="text-[16px] font-normal text-[#71717A]">
                Already have an account?
              </p>
              <p
                className="text-[16px] font-normal text-[#2563EB] hover:underline cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Log in
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <img
          src="/login.jpg"
          className="w-[1296px] h-[1074px] rounded-lg"
          alt="create password"
        />
      </div>
    </div>
  );
}

export default function CreatePass() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-black">
          Loading...
        </div>
      }
    >
      <CreatePassForm />
    </Suspense>
  );
}
