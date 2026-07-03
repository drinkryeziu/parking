import { useState } from "react";
import { ArrowLeft, Lock, Shield, CreditCard } from "lucide-react";

interface Props {
  onBack: () => void;
  onPay: () => void;
  total: number;
  type: "credit" | "debit";
  bookingId?: string | null;
  token?: string | null;
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const v = value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 2) return v.slice(0, 2) + "/" + v.slice(2);
  return v;
}

export function CardPaymentScreen({ onBack, onPay, total, type }: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onPay(); }, 2000);
  };

  const isValid = cardNumber.replace(/\s/g, "").length === 16 && name && expiry.length === 5 && cvv.length >= 3 && zip.length >= 5;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "24px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>
            {type === "credit" ? "Credit Card" : "Debit Card"}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={14} color="#22C55E" />
          <span className="text-green-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Secure</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-5 pb-32">
        {/* Card Visual */}
        <div className="rounded-2xl p-5 relative overflow-hidden h-44" style={{ background: "linear-gradient(135deg, #024ad8 0%, #0133a0 100%)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 bg-white translate-y-1/4 -translate-x-1/4" />
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <CreditCard size={28} color="rgba(255,255,255,0.8)" />
              <p className="text-white/60" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>SWEETWATER PARKING</p>
            </div>
            <div>
              <p className="text-white/50 mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em" }}>CARD NUMBER</p>
              <p className="text-white tracking-widest" style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, letterSpacing: "0.15em" }}>
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/50" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px" }}>CARDHOLDER</p>
                <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>{name || "YOUR NAME"}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px" }}>EXPIRES</p>
                <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between">
          <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}>Amount due</span>
          <span style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700, color: "#007AFF" }}>${total}</span>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Payment Details</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-4">
            <div>
              <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>CARD NUMBER</label>
              <input
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
            </div>
            <div>
              <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>CARDHOLDER NAME</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>EXPIRY DATE</label>
                <input
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
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
                  className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                />
              </div>
            </div>
            <div>
              <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>BILLING ZIP CODE</label>
              <input
                value={zip}
                onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="12345"
                inputMode="numeric"
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
            </div>

          </div>
        </div>

        {/* Security */}
        <div className="flex items-center gap-3 px-1">
          <Shield size={16} color="#22C55E" />
          <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>256-bit SSL encryption · PCI DSS compliant · Your data is never stored</p>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full h-14 rounded-xl text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: "#007AFF", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          {processing ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Lock size={16} />
              Pay Now · ${total}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
