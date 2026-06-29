import { useState } from "react";
import { Eye, EyeOff, Truck } from "lucide-react";

interface Props {
  onLogin: () => void;
  onGuest: () => void;
  onCreateAccount: () => void;
}

export function LoginScreen({ onLogin, onGuest, onCreateAccount }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "linear-gradient(160deg, #024ad8 0%, #0133a0 60%, #01257a 100%)" }}>
      {/* Header */}
      <div className="flex flex-col items-center pt-14 pb-6 px-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mb-5 backdrop-blur-sm border border-white/20">
          <Truck size={32} color="white" />
        </div>
        <div className="text-center">
          <p className="text-white/60 tracking-[0.25em] uppercase" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "13px", fontWeight: 500 }}>SWEETWATER</p>
          <h1 className="text-white tracking-[0.15em] uppercase" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "38px", fontWeight: 700, lineHeight: 1.1 }}>PARKING</h1>
          <p className="text-white/40 tracking-[0.3em] uppercase" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "20px", fontWeight: 500 }}>SPOT</p>
        </div>
        <p className="text-white/50 mt-3 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Secure parking for professional drivers</p>
      </div>

      {/* Card */}
      <div className="flex-1 mx-4 mb-6 bg-white rounded-3xl px-6 py-8 shadow-2xl flex flex-col gap-5">
        <h2 className="text-gray-900 mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 700 }}>Sign In</h2>

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em" }}>USERNAME</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em" }}>PASSWORD</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-end">
            <button className="text-blue-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>Forgot Password?</button>
          </div>
        </div>

        {/* Sign In */}
        <button
          onClick={onLogin}
          className="w-full h-14 rounded-xl text-white transition-all active:scale-[0.98]"
          style={{ background: "#024ad8", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={onLogin}
          className="w-full h-14 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-3 active:bg-gray-50 transition-all"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600, color: "#333" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Guest */}
        <button
          onClick={onGuest}
          className="w-full h-14 rounded-xl border-2 border-blue-600 text-blue-600 active:bg-blue-50 transition-all"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700 }}
        >
          Continue as Guest
        </button>

        {/* Create Account */}
        <p className="text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <button onClick={onCreateAccount} className="text-blue-600" style={{ fontWeight: 600 }}>Create Account</button>
        </p>
      </div>
    </div>
  );
}
