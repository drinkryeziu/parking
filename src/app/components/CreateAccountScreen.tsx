import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Truck, CheckCircle, User, Mail, Phone, Lock, CreditCard, Plus, X } from "lucide-react";
import { api } from "../../lib/api";
import { AuthUser } from "../../lib/auth";

interface Props {
  onBack: () => void;
  onAuthSuccess: (token: string, user: AuthUser) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  agreeSMS: boolean;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["#EF4444", "#F97316", "#EAB308", "#22C55E"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all"
            style={{ background: i < score ? colors[score - 1] : "#E5E7EB" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(c => (
            <div key={c.label} className="flex items-center gap-1">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${c.ok ? "bg-green-500" : "bg-gray-200"}`}>
                {c.ok && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: c.ok ? "#16A34A" : "#9CA3AF" }}>{c.label}</span>
            </div>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: colors[score - 1] }}>{labels[score - 1]}</span>
        )}
      </div>
    </div>
  );
}

function InputField({
  label, value, onChange, placeholder, type = "text", icon, rightEl, error
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  rightEl?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}>{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
        )}
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className={`w-full h-14 rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all
            ${icon ? "pl-11" : "pl-4"} ${rightEl ? "pr-12" : "pr-4"}
            ${error ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
        />
        {rightEl && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {error && <p className="text-red-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{error}</p>}
    </div>
  );
}

type PaymentType = "credit" | "debit" | "venmo" | "cashapp" | "zelle";

const PAYMENT_OPTIONS: { id: PaymentType; label: string; sub: string; bg: string; logo: React.ReactNode }[] = [
  {
    id: "credit",
    label: "Credit Card",
    sub: "Visa, Mastercard, Amex",
    bg: "#1A1F36",
    logo: <svg width="22" height="15" viewBox="0 0 22 15" fill="none"><rect width="22" height="15" rx="2.5" fill="#1A1F36"/><rect y="4" width="22" height="4" fill="#F5A623"/><rect x="2" y="9.5" width="5" height="2" rx="1" fill="white"/></svg>,
  },
  {
    id: "debit",
    label: "Debit Card",
    sub: "All major banks",
    bg: "#0D5C3D",
    logo: <svg width="22" height="15" viewBox="0 0 22 15" fill="none"><rect width="22" height="15" rx="2.5" fill="#0D5C3D"/><rect y="4" width="22" height="4" fill="#48BB78"/><rect x="2" y="9.5" width="5" height="2" rx="1" fill="white"/></svg>,
  },
  {
    id: "venmo",
    label: "Venmo",
    sub: "@handle",
    bg: "#008CFF",
    logo: <svg width="20" height="20" viewBox="0 0 30 30"><text x="3" y="22" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">V</text></svg>,
  },
  {
    id: "cashapp",
    label: "Cash App",
    sub: "$cashtag",
    bg: "#00D64F",
    logo: <svg width="20" height="20" viewBox="0 0 30 30"><text x="5" y="22" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">$</text></svg>,
  },
  {
    id: "zelle",
    label: "Zelle",
    sub: "Bank transfer",
    bg: "#6D1ED4",
    logo: <svg width="20" height="20" viewBox="0 0 30 30"><text x="5" y="22" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">Z</text></svg>,
  },
];

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 4);
  return n.length >= 2 ? n.slice(0, 2) + "/" + n.slice(2) : n;
}

function PaymentMethodSection() {
  const [selected, setSelected] = useState<PaymentType | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [handle, setHandle] = useState("");
  const [saved, setSaved] = useState(false);

  const chosen = PAYMENT_OPTIONS.find(p => p.id === selected);
  const isCard = selected === "credit" || selected === "debit";

  const handleSave = () => {
    setSaved(true);
    setExpanded(false);
  };

  const handleRemove = () => {
    setSaved(false);
    setSelected(null);
    setCardNumber(""); setCardName(""); setExpiry(""); setCvv(""); setHandle("");
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <CreditCard size={14} color="#2563EB" />
          </div>
          <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Payment Method</p>
        </div>
        <span className="text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>Optional</span>
      </div>

      {/* Saved state */}
      {saved && chosen ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: chosen.bg }}>
            {chosen.logo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>{chosen.label}</p>
            <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
              {isCard && cardNumber ? `•••• ${cardNumber.replace(/\s/g, "").slice(-4)}` : handle || chosen.sub}
            </p>
          </div>
          <div className="flex items-center gap-1 text-green-600 mr-2">
            <CheckCircle size={15} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Saved</span>
          </div>
          <button onClick={handleRemove} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:bg-gray-200">
            <X size={14} />
          </button>
        </div>
      ) : !expanded ? (
        /* Add button */
        <button
          onClick={() => setExpanded(true)}
          className="w-full h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 active:bg-gray-50 transition-all"
        >
          <Plus size={18} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Add payment method</span>
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Skip hint */}
          <div className="flex items-center justify-between">
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Select a method to add now, or skip and add later</p>
            <button onClick={() => setExpanded(false)} className="text-gray-400 active:text-gray-600">
              <X size={16} />
            </button>
          </div>

          {/* Method tiles */}
          <div className="flex flex-col gap-2">
            {PAYMENT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${selected === opt.id ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50 active:bg-gray-100"}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: opt.bg }}>
                  {opt.logo}
                </div>
                <div className="text-left flex-1">
                  <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>{opt.label}</p>
                  <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{opt.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === opt.id ? "border-blue-500" : "border-gray-300"}`}>
                  {selected === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
              </button>
            ))}
          </div>

          {/* Detail fields */}
          {selected && (
            <div className="flex flex-col gap-3 pt-1">
              {isCard ? (
                <>
                  <div>
                    <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>CARD NUMBER</label>
                    <input
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all tracking-wider"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>CARDHOLDER NAME</label>
                    <input
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>EXPIRY</label>
                      <input
                        value={expiry}
                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>CVV</label>
                      <input
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        type="password"
                        inputMode="numeric"
                        className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>
                    {selected === "venmo" ? "VENMO @HANDLE" : selected === "cashapp" ? "CASH APP $CASHTAG" : "ZELLE EMAIL OR PHONE"}
                  </label>
                  <input
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    placeholder={selected === "venmo" ? "@yourhandle" : selected === "cashapp" ? "$yourcashtag" : "email or phone"}
                    className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  className="flex-1 h-12 rounded-xl text-white transition-all active:scale-[0.98]"
                  style={{ background: "#024ad8", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}
                >
                  Save Payment Method
                </button>
                <button
                  onClick={() => { setExpanded(false); setSelected(null); }}
                  className="h-12 px-4 rounded-xl border border-gray-200 text-gray-500 active:bg-gray-50 transition-all"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {!selected && (
            <button
              onClick={() => setExpanded(false)}
              className="w-full h-12 rounded-xl border border-gray-200 text-gray-500 active:bg-gray-50 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
            >
              Skip for now
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export function CreateAccountScreen({ onBack, onAuthSuccess }: Props) {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeSMS: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Enter a valid phone number";
    if (!form.password || form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms)
      e.agreeTerms = "You must agree to the Terms of Service";
    return e;
  };

  const [apiError, setApiError] = useState("");

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    setApiError("");
    try {
      const data = await api.post("/api/auth/register", {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => onAuthSuccess(data.token, data.user), 1800);
    } catch (err: any) {
      setApiError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "linear-gradient(160deg, #024ad8 0%, #0133a0 100%)" }}>
        <div className="bg-white rounded-3xl p-10 w-full flex flex-col items-center gap-5 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={44} color="#22C55E" />
          </div>
          <div className="text-center">
            <h2 className="text-gray-900 mb-2" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "30px", fontWeight: 700 }}>
              Account Created!
            </h2>
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
              Welcome, {form.firstName}! Redirecting you to your booking…
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce bg-blue-600" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-8 flex flex-col"
        style={{ background: "linear-gradient(160deg, #024ad8 0%, #0133a0 100%)" }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white active:bg-white/30 mb-5 self-start"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 backdrop-blur-sm flex-shrink-0">
            <Truck size={28} color="white" />
          </div>
          <div>
            <p className="text-white/60 tracking-[0.2em] uppercase" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "11px", fontWeight: 500 }}>SWEETWATER</p>
            <h1 className="text-white tracking-[0.1em] uppercase leading-tight" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700 }}>PARKING SPOT</h1>
            <p className="text-white/50 mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Create your driver account</p>
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
        {["Personal Info", "Security", "Preferences"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-blue-600" : i === 1 ? "bg-blue-300" : "bg-gray-200"}`}>
              <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>{i + 1}</span>
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#1D4ED8" : "#9CA3AF" }}>{step}</span>
            {i < 2 && <div className="flex-1 h-px bg-blue-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-6 pb-36">

        {/* Personal Info */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <User size={14} color="#2563EB" />
            </div>
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Personal Information</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <InputField
                  label="FIRST NAME"
                  value={form.firstName}
                  onChange={v => set("firstName", v)}
                  placeholder="John"
                  error={errors.firstName}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="LAST NAME"
                  value={form.lastName}
                  onChange={v => set("lastName", v)}
                  placeholder="Smith"
                  error={errors.lastName}
                />
              </div>
            </div>
            <InputField
              label="EMAIL ADDRESS"
              value={form.email}
              onChange={v => set("email", v)}
              placeholder="john@example.com"
              type="email"
              icon={<Mail size={16} color="#9CA3AF" />}
              error={errors.email}
            />
            <InputField
              label="PHONE NUMBER"
              value={form.phone}
              onChange={v => set("phone", v)}
              placeholder="+1 (555) 000-0000"
              type="tel"
              icon={<Phone size={16} color="#9CA3AF" />}
              error={errors.phone}
            />
          </div>
        </section>

        {/* Company */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <Truck size={14} color="#2563EB" />
            </div>
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Company (Optional)</p>
          </div>
          <InputField
            label="COMPANY NAME"
            value={form.companyName}
            onChange={v => set("companyName", v)}
            placeholder="Max Carriers Inc."
          />
        </section>

        {/* Password */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <Lock size={14} color="#2563EB" />
            </div>
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Create Password</p>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <InputField
                label="PASSWORD"
                value={form.password}
                onChange={v => set("password", v)}
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                icon={<Lock size={16} color="#9CA3AF" />}
                rightEl={
                  <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={errors.password}
              />
              <PasswordStrength password={form.password} />
            </div>
            <InputField
              label="CONFIRM PASSWORD"
              value={form.confirmPassword}
              onChange={v => set("confirmPassword", v)}
              placeholder="Re-enter your password"
              type={showConfirm ? "text" : "password"}
              icon={<Lock size={16} color="#9CA3AF" />}
              rightEl={
                <button onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              error={errors.confirmPassword}
            />
          </div>
        </section>

        {/* Payment Method */}
        <PaymentMethodSection />

        {/* Agreements */}
        <section className="flex flex-col gap-3">
          <button
            onClick={() => set("agreeTerms", !form.agreeTerms)}
            className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 transition-all text-left"
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form.agreeTerms ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
              {form.agreeTerms && <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div>
              <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                I agree to the{" "}
                <span className="text-blue-600 font-semibold">Terms of Service</span>
                {" "}and{" "}
                <span className="text-blue-600 font-semibold">Privacy Policy</span>
              </p>
              {errors.agreeTerms && <p className="text-red-500 mt-1" style={{ fontSize: "12px" }}>{errors.agreeTerms}</p>}
            </div>
          </button>

          <button
            onClick={() => set("agreeSMS", !form.agreeSMS)}
            className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 transition-all text-left"
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${form.agreeSMS ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
              {form.agreeSMS && <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
              Receive SMS updates about my bookings and promotions
            </p>
          </button>
        </section>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        {apiError && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <p className="text-red-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{apiError}</p>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-14 rounded-xl text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: "#024ad8", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Creating Account…
            </>
          ) : (
            "Create Account"
          )}
        </button>
        <p className="text-center mt-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#9CA3AF" }}>
          Already have an account?{" "}
          <button onClick={onBack} className="text-blue-600" style={{ fontWeight: 600 }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}
