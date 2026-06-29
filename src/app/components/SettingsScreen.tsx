import { useState } from "react";
import {
  ArrowLeft, User, CreditCard, Bell, Lock, ChevronRight,
  Eye, EyeOff, Phone, Mail, Truck, Plus, X, CheckCircle,
  Moon, Globe, HelpCircle, LogOut, Shield
} from "lucide-react";

interface Props {
  onBack: () => void;
}

type Section = "main" | "profile" | "payment" | "notifications" | "security" | "preferences";
type PaymentType = "credit" | "debit" | "venmo" | "cashapp" | "zelle";

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
      <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100">
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-gray-900" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, color: "#007AFF" }}>{title}</h2>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>{label}</label>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        type={type} placeholder={placeholder}
        className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
      />
    </div>
  );
}

function SaveButton({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <button
      onClick={onSave}
      className="w-full h-14 rounded-xl text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      style={{ background: saved ? "#22C55E" : "#024ad8", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
    >
      {saved ? <><CheckCircle size={18} /> Saved!</> : "Save Changes"}
    </button>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────
function ProfileSection({ onBack }: { onBack: () => void }) {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Smith");
  const [email, setEmail] = useState("john.smith@example.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [company, setCompany] = useState("Max Carriers Inc.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SectionHeader onBack={onBack} title="Profile" />
      <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-28">
        {/* Avatar */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-3 relative">
            <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 700 }}>
              {firstName[0]}{lastName[0]}
            </span>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
              <Plus size={14} color="#007AFF" />
            </button>
          </div>
          <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}>{firstName} {lastName}</p>
          <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{email}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <User size={14} color="#007AFF" />
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Personal Info</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="FIRST NAME" value={firstName} onChange={setFirstName} placeholder="John" /></div>
            <div className="flex-1"><Field label="LAST NAME" value={lastName} onChange={setLastName} placeholder="Smith" /></div>
          </div>
          <Field label="EMAIL" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
          <Field label="PHONE" value={phone} onChange={setPhone} type="tel" placeholder="+1 (555) 000-0000" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <Truck size={14} color="#007AFF" />
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Company</p>
          </div>
          <Field label="COMPANY NAME" value={company} onChange={setCompany} placeholder="Carrier Inc." />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}

// ── Payment Section ───────────────────────────────────────────────────────────
const PAYMENT_OPTIONS: { id: PaymentType; label: string; sub: string; bg: string; logo: React.ReactNode }[] = [
  { id: "credit", label: "Credit Card", sub: "Visa, Mastercard, Amex", bg: "#1A1F36", logo: <svg width="22" height="15" viewBox="0 0 22 15" fill="none"><rect width="22" height="15" rx="2.5" fill="#1A1F36"/><rect y="4" width="22" height="4" fill="#F5A623"/><rect x="2" y="9.5" width="5" height="2" rx="1" fill="white"/></svg> },
  { id: "debit", label: "Debit Card", sub: "All major banks", bg: "#0D5C3D", logo: <svg width="22" height="15" viewBox="0 0 22 15" fill="none"><rect width="22" height="15" rx="2.5" fill="#0D5C3D"/><rect y="4" width="22" height="4" fill="#48BB78"/><rect x="2" y="9.5" width="5" height="2" rx="1" fill="white"/></svg> },
  { id: "venmo", label: "Venmo", sub: "@handle", bg: "#008CFF", logo: <svg width="20" height="20" viewBox="0 0 30 30"><text x="3" y="22" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">V</text></svg> },
  { id: "cashapp", label: "Cash App", sub: "$cashtag", bg: "#00D64F", logo: <svg width="20" height="20" viewBox="0 0 30 30"><text x="5" y="22" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">$</text></svg> },
  { id: "zelle", label: "Zelle", sub: "Bank transfer", bg: "#6D1ED4", logo: <svg width="20" height="20" viewBox="0 0 30 30"><text x="5" y="22" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">Z</text></svg> },
];

function formatCard(v: string) { return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }
function formatExpiry(v: string) { const n = v.replace(/\D/g, "").slice(0, 4); return n.length >= 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; }

interface SavedPayment { id: string; type: PaymentType; display: string; detail: string; }

function PaymentSection({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState<SavedPayment[]>([
    { id: "1", type: "credit", display: "Credit Card", detail: "•••• 4242" },
  ]);
  const [adding, setAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [handle, setHandle] = useState("");

  const isCard = selectedType === "credit" || selectedType === "debit";

  const handleAdd = () => {
    if (!selectedType) return;
    const opt = PAYMENT_OPTIONS.find(p => p.id === selectedType)!;
    const detail = isCard ? (cardNumber ? `•••• ${cardNumber.replace(/\s/g,"").slice(-4)}` : opt.sub) : (handle || opt.sub);
    setSaved(prev => [...prev, { id: Date.now().toString(), type: selectedType, display: opt.label, detail }]);
    setAdding(false); setSelectedType(null); setCardNumber(""); setCardName(""); setExpiry(""); setCvv(""); setHandle("");
  };

  const remove = (id: string) => setSaved(prev => prev.filter(p => p.id !== id));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SectionHeader onBack={onBack} title="Payment Methods" />
      <div className="flex-1 px-4 py-5 flex flex-col gap-4">

        {/* Saved methods */}
        {saved.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>SAVED METHODS</p>
            </div>
            {saved.map((pm, i) => {
              const opt = PAYMENT_OPTIONS.find(p => p.id === pm.type)!;
              return (
                <div key={pm.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < saved.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: opt.bg }}>{opt.logo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>{pm.display}</p>
                    <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{pm.detail}</p>
                  </div>
                  <button onClick={() => remove(pm.id)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:bg-red-50 active:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new */}
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="w-full h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 active:bg-gray-50 transition-all"
          >
            <Plus size={18} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Add payment method</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Add New Method</p>
              <button onClick={() => { setAdding(false); setSelectedType(null); }} className="text-gray-400"><X size={16} /></button>
            </div>

            {PAYMENT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedType === opt.id ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50 active:bg-gray-100"}`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: opt.bg }}>{opt.logo}</div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>{opt.label}</p>
                  <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{opt.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selectedType === opt.id ? "border-blue-500" : "border-gray-300"}`}>
                  {selectedType === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
              </button>
            ))}

            {selectedType && (
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-50">
                {isCard ? (
                  <>
                    <Field label="CARD NUMBER" value={cardNumber} onChange={v => setCardNumber(formatCard(v))} placeholder="0000 0000 0000 0000" />
                    <Field label="CARDHOLDER NAME" value={cardName} onChange={setCardName} placeholder="John Smith" />
                    <div className="flex gap-3">
                      <div className="flex-1"><Field label="EXPIRY" value={expiry} onChange={v => setExpiry(formatExpiry(v))} placeholder="MM/YY" /></div>
                      <div className="w-28"><Field label="CVV" value={cvv} onChange={v => setCvv(v.replace(/\D/g,"").slice(0,4))} placeholder="•••" type="password" /></div>
                    </div>
                  </>
                ) : (
                  <Field
                    label={selectedType === "venmo" ? "VENMO @HANDLE" : selectedType === "cashapp" ? "CASH APP $CASHTAG" : "ZELLE EMAIL OR PHONE"}
                    value={handle} onChange={setHandle}
                    placeholder={selectedType === "venmo" ? "@yourhandle" : selectedType === "cashapp" ? "$yourcashtag" : "email or phone"}
                  />
                )}
                <button
                  onClick={handleAdd}
                  className="w-full h-12 rounded-xl text-white"
                  style={{ background: "#024ad8", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}
                >
                  Save Method
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────
function NotificationsSection({ onBack }: { onBack: () => void }) {
  const [bookingConfirm, setBookingConfirm] = useState(true);
  const [expiryReminders, setExpiryReminders] = useState(true);
  const [promos, setPromos] = useState(false);
  const [alerts, setAlerts] = useState({ "1d": true, "6h": true, "1h": false, "30m": false });
  const [methods, setMethods] = useState<Set<string>>(new Set(["sms"]));
  const [saved, setSaved] = useState(false);

  const toggleAlert = (k: string) => setAlerts(p => ({ ...p, [k]: !p[k as keyof typeof p] }));
  const toggleMethod = (m: string) => setMethods(prev => { const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n; });
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-all ${value ? "bg-blue-600" : "bg-gray-200"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[26px]" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SectionHeader onBack={onBack} title="Notifications" />
      <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-28">

        {/* General */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>GENERAL</p>
          </div>
          {[
            { label: "Booking Confirmations", sub: "Get notified when booking is confirmed", value: bookingConfirm, onChange: () => setBookingConfirm(!bookingConfirm) },
            { label: "Expiry Reminders", sub: "Alerts before your reservation ends", value: expiryReminders, onChange: () => setExpiryReminders(!expiryReminders) },
            { label: "Promotions & Offers", sub: "Discounts and special parking deals", value: promos, onChange: () => setPromos(!promos) },
          ].map(({ label, sub, value, onChange }, i, arr) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex-1">
                <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>{label}</p>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{sub}</p>
              </div>
              <Toggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>

        {/* Expiry alert timing */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>REMIND ME BEFORE EXPIRY</p>
          </div>
          {[
            { key: "1d", label: "1 day before" },
            { key: "6h", label: "6 hours before" },
            { key: "1h", label: "1 hour before" },
            { key: "30m", label: "30 min before" },
          ].map(({ key, label }, i, arr) => (
            <button key={key} onClick={() => toggleAlert(key)} className={`w-full flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${alerts[key as keyof typeof alerts] ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                {alerts[key as keyof typeof alerts] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-gray-800 text-left" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Notify via */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-gray-500 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>NOTIFY VIA</p>
          <div className="flex gap-2">
            {[
              { id: "sms", icon: <Phone size={14} />, label: "SMS" },
              { id: "email", icon: <Mail size={14} />, label: "Email" },
              { id: "push", icon: <Bell size={14} />, label: "Push" },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleMethod(opt.id)}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 border-2 transition-all ${methods.has(opt.id) ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-200 text-gray-400"}`}
              >
                {opt.icon}
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}

// ── Security Section ──────────────────────────────────────────────────────────
function SecuritySection({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (newPass && newPass !== confirm) { setError("Passwords do not match"); return; }
    if (newPass && newPass.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button onClick={toggle} className="text-gray-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
  );

  const PasswordField = ({ label, value, onChange, show, toggleShow }: { label: string; value: string; onChange: (v: string) => void; show: boolean; toggleShow: () => void }) => (
    <div>
      <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <input value={value} onChange={e => onChange(e.target.value)} type={show ? "text" : "password"}
          className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }} />
        <div className="absolute right-4 top-1/2 -translate-y-1/2"><EyeBtn show={show} toggle={toggleShow} /></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SectionHeader onBack={onBack} title="Security" />
      <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-28">

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <Lock size={14} color="#007AFF" />
            <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Change Password</p>
          </div>
          <PasswordField label="CURRENT PASSWORD" value={current} onChange={setCurrent} show={showCurrent} toggleShow={() => setShowCurrent(!showCurrent)} />
          <PasswordField label="NEW PASSWORD" value={newPass} onChange={setNewPass} show={showNew} toggleShow={() => setShowNew(!showNew)} />
          <PasswordField label="CONFIRM NEW PASSWORD" value={confirm} onChange={setConfirm} show={showConfirm} toggleShow={() => setShowConfirm(!showConfirm)} />
          {error && <p className="text-red-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{error}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>ACCOUNT SECURITY</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Shield size={16} color="#007AFF" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>Two-Factor Authentication</p>
              <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Extra security via SMS code</p>
            </div>
            <button onClick={() => setTwoFA(!twoFA)} className={`w-12 h-6 rounded-full relative transition-all ${twoFA ? "bg-blue-600" : "bg-gray-200"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${twoFA ? "left-[26px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut size={16} color="#EF4444" />
            </div>
            <span className="text-red-500 flex-1 text-left" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Sign Out of All Devices</span>
            <ChevronRight size={16} color="#EF4444" />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}

// ── Preferences Section ───────────────────────────────────────────────────────
function PreferencesSection({ onBack }: { onBack: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [units, setUnits] = useState<"imperial" | "metric">("imperial");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-all ${value ? "bg-blue-600" : "bg-gray-200"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[26px]" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SectionHeader onBack={onBack} title="Preferences" />
      <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-28">

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>APPEARANCE</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Moon size={16} color="#6B7280" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>Dark Mode</p>
              <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Switch to dark theme</p>
            </div>
            <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>LANGUAGE & REGION</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Globe size={16} color="#007AFF" />
            </div>
            <p className="text-gray-900 flex-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>Language</p>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="text-blue-600 bg-transparent outline-none border-none" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>
              {["English", "Spanish", "French", "Portuguese", "German"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="px-4 py-4">
            <p className="text-gray-900 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>Distance Units</p>
            <div className="flex gap-2">
              {(["imperial", "metric"] as const).map(u => (
                <button key={u} onClick={() => setUnits(u)} className={`flex-1 h-10 rounded-xl border-2 transition-all ${units === u ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-200 text-gray-400"}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                  {u === "imperial" ? "Imperial (mi)" : "Metric (km)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <HelpCircle size={16} color="#007AFF" />
            </div>
            <span className="text-gray-800 flex-1 text-left" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>Help & Support</span>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
        </div>

        <p className="text-center text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
          Sweetwater Parking v1.0.0
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}

// ── Main Settings Screen ──────────────────────────────────────────────────────
export function SettingsScreen({ onBack }: Props) {
  const [section, setSection] = useState<Section>("main");

  if (section === "profile") return <ProfileSection onBack={() => setSection("main")} />;
  if (section === "payment") return <PaymentSection onBack={() => setSection("main")} />;
  if (section === "notifications") return <NotificationsSection onBack={() => setSection("main")} />;
  if (section === "security") return <SecuritySection onBack={() => setSection("main")} />;
  if (section === "preferences") return <PreferencesSection onBack={() => setSection("main")} />;

  const items = [
    { id: "profile" as Section, icon: <User size={18} color="#007AFF" />, label: "Profile", sub: "Name, email, phone, company", bg: "bg-blue-50" },
    { id: "payment" as Section, icon: <CreditCard size={18} color="#7C3AED" />, label: "Payment Methods", sub: "Manage saved cards & wallets", bg: "bg-purple-50" },
    { id: "notifications" as Section, icon: <Bell size={18} color="#F59E0B" />, label: "Notifications", sub: "Alerts, reminders, channels", bg: "bg-amber-50" },
    { id: "security" as Section, icon: <Lock size={18} color="#EF4444" />, label: "Security", sub: "Password, two-factor auth", bg: "bg-red-50" },
    { id: "preferences" as Section, icon: <Globe size={18} color="#10B981" />, label: "Preferences", sub: "Language, appearance, units", bg: "bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "26px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>Settings</h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-3">
        {/* Account card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 700 }}>JS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}>John Smith</p>
            <p className="text-gray-400 truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>john.smith@example.com</p>
          </div>
          <button onClick={() => setSection("profile")} className="text-blue-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>Edit</button>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {items.map(({ id, icon, label, sub, bg }, i) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-all ${i < items.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>
              <div className="flex-1 text-left">
                <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>{label}</p>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{sub}</p>
              </div>
              <ChevronRight size={16} color="#D1D5DB" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-4 active:bg-red-50 transition-all">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut size={16} color="#EF4444" />
            </div>
            <span className="text-red-500 flex-1 text-left" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Sign Out</span>
          </button>
        </div>

        <p className="text-center text-gray-300 pb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>v1.0.0 · Sweetwater Parking</p>
      </div>
    </div>
  );
}
