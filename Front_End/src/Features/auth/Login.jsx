
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiShield, FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight, } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: ""

    }
  });
  const navigate = useNavigate()
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data) => {
    setLoginError("");
    setIsLoading(true);

    try {
      await login(data, rememberMe);
      console.log("Login User Data.", data.user)
      reset();
      setShowPassword(false);

      navigate("/dashboard", { replace: true });
    } catch (error) {

      setLoginError(
        error.response?.data?.message ||
        error.message ||
        "Login failed!"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main
      dir="ltr"
      lang="en"
      style={{
        direction: "ltr",
        textAlign: "left",
        writingMode: "horizontal-tb"
      }}
      className="h-screen overflow-hidden bg-[#191c22] flex items-center justify-center p-10 text-[#f1f3f7]"
    >
      <section
        dir="ltr"
        style={{ direction: "ltr" }}
        className="w-full max-w-275 min-h-130 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-[90px]"
      >
        {/* Introduction */}
        <div className="flex flex-col justify-between min-h-[400px]">

          <div className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] grid place-items-center text-[23px] rounded-[13px] bg-gradient-to-br from-[#119c91] to-[#5965ed]">
              <FiShield />
            </div>

            <h2 className="text-[23px] font-bold tracking-tight">
              Carpet<span className="text-[#48b9b0]">Pro</span>
            </h2>
          </div>

          <div className="my-12 lg:my-[65px]">
            <span className="text-[#43b8ad] text-[11px] tracking-[2px] font-bold">
              BUSINESS MANAGEMENT SYSTEM
            </span>

            <h1 className="text-[34px] sm:text-[48px] leading-tight tracking-tight font-bold my-[18px]">
              Your business,
              <br />
              <span className="text-[#49b9af]">
                under control.
              </span>
            </h1>

            <p className="max-w-[410px] text-[#a4a9b5] text-sm leading-[1.9]">
              Manage your inventory, sales and daily
              operations with one simple and powerful
              management system.
            </p>

            <div className="flex flex-wrap gap-3 mt-[30px]">

              <div className="border border-[#3b414d] bg-[#20242c] rounded-xl px-[17px] py-[14px] flex flex-col gap-[6px] hover:border-[#43b8ad] transition">
                <strong className="text-xs">Simple & Secure</strong>
                <span className="text-[11px] text-[#9299a8]">
                  Designed for your business
                </span>
              </div>

              <div className="border border-[#3b414d] bg-[#20242c] rounded-xl px-[17px] py-[14px] flex flex-col gap-[6px] hover:border-[#43b8ad] transition">
                <strong className="text-xs">All in One</strong>
                <span className="text-[11px] text-[#9299a8]">
                  Everything in one workspace
                </span>
              </div>

            </div>
          </div>

          <div className="text-[#727987] text-[11px]">
            © 2026 CarpetPro. All rights reserved.
          </div>

        </div>

        {/* Login Form */}
        <div className="flex justify-center">

          <div className="w-full bg-[#20232b] border border-[#3a414d] rounded-[17px] p-8 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">

            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back
              </h2>

              <p className="text-[13px] text-[#929baa]">
                Login with your username and password.
              </p>
            </div>

            <div className="h-px bg-[#3b414d] my-[25px]" />

            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>

              {/* Username */}
              <div className="mb-[23px]">

                <label className="block text-[13px] font-semibold mb-[9px]">
                  Username <span className="text-[#f16c76]">*</span>
                </label>

                <div className="h-12 bg-[#30394a] border border-[#414b5d] rounded-[10px] flex items-center px-[13px] gap-3 focus-within:border-[#36aaa5] focus-within:ring-2 focus-within:ring-[#36aaa5]/10 transition">

                  <FiUser className="text-[#a2adbd] text-[17px] shrink-0" />

                  <input

                    type="text"
                    placeholder="Enter your username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    className="w-full bg-transparent outline-none text-white text-[13px] placeholder:text-[#8993a4]"
                  />

                </div>
                <div className="h-[15px] pt-[3px]">
                  {errors.username && (
                    <small className="block text-[#f16c76] text-[11px]">
                      {errors.username.message}
                    </small>
                  )}
                </div>

              </div>

              {/* Password */}
              <div className="mb-[23px]">

                <label className="block text-[13px] font-semibold mb-[9px]">
                  Password <span className="text-[#f16c76]">*</span>
                </label>

                <div className="h-12 bg-[#30394a] border border-[#414b5d] rounded-[10px] flex items-center px-[13px] gap-3 focus-within:border-[#36aaa5] focus-within:ring-2 focus-within:ring-[#36aaa5]/10 transition">

                  <FiLock className="text-[#a2adbd] text-[17px] shrink-0" />

                  <input

                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full bg-transparent outline-none text-white text-[13px] placeholder:text-[#8993a4]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#aab3c1] hover:text-white flex text-[17px] cursor-pointer">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className="h-[25px] pt-[7px]">
                  {errors.password && (
                    <small className="block text-[#f16c76] text-[11px]">
                      {errors.password.message}
                    </small>
                  )}
                </div>
              </div>
              {/* Options */}
              <div className="flex items-center justify-between my-6 text-xs gap-2 flex-wrap">

                <label className="flex items-center gap-2 text-[#b0b7c4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#30aaa0] w-[15px] h-[15px]"
                  />
                </label>
                <span className="flex items-center gap-[6px] text-[#8994a4]"> <FiShield /> Secure Login </span>
              </div>
              {/* Submit */}
              <div className="h-[24px] flex items-center mb-2">
                {loginError && (
                  <p className="text-[#f16c76] text-xs leading-5">
                    {loginError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-[10px] bg-gradient-to-r from-[#119d91] to-[#5964ed] text-white text-sm font-bold flex items-center justify-center gap-3 hover:brightness-110 hover:-translate-y-0.5 transition duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
                <FiArrowRight />
              </button>
            </form>
            <p className="text-center text-[#747d8b] text-[11px] mt-[25px]"> Authorized personnel only. </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
