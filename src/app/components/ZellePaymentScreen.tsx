import { useState } from "react";
import { ArrowLeft, Copy, CheckCircle, Clock } from "lucide-react";

interface Props {
  onBack: () => void;
  onPay: () => void;
  total: number;
}

export function ZellePaymentScreen({ onBack, onPay, total }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "confirmed">("idle");

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirm = () => {
    setStatus("pending");
    setTimeout(() => setStatus("confirmed"), 2000);
  };

  if (status === "confirmed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#6D1ED4" }}>
        <div className="bg-white rounded-3xl p-8 w-full flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
            <CheckCircle size={40} color="#6D1ED4" />
          </div>
          <h2 className="text-gray-900" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700 }}>Transfer Sent!</h2>
          <p className="text-gray-500 text-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Your Zelle transfer of ${total} is being processed. Booking will be confirmed shortly.</p>
          <button
            onClick={onPay}
            className="w-full h-14 rounded-xl text-white mt-2"
            style={{ background: "#6D1ED4", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
          >
            View Booking Confirmation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#6D1ED4" }}>
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white active:bg-white/30">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>Zelle</h1>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-5 pb-24 pt-4">
        <div className="text-center">
          <p className="text-white/70 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Transfer amount</p>
          <p className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "64px", fontWeight: 700, lineHeight: 1 }}>${total}</p>
        </div>

        {/* Bank Transfer Details */}
        <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm flex flex-col gap-4">
          <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700 }}>Send Zelle to:</p>

          {[
            { label: "Phone Number", value: "+1 (555) 847-2390", key: "phone" },
            { label: "Email", value: "payments@sweetwaterparking.com", key: "email" },
            { label: "Recipient Name", value: "Sweetwater Parking LLC", key: "name" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white/60" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>{item.label.toUpperCase()}</p>
                <p className="text-white truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>{item.value}</p>
              </div>
              <button
                onClick={() => copy(item.value, item.key)}
                className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 active:bg-white/30"
              >
                {copied === item.key ? <CheckCircle size={16} color="white" /> : <Copy size={16} color="white" />}
              </button>
            </div>
          ))}

          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/70" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
              <span className="text-white font-semibold">Memo: </span>Include your name and "PARKING" in the Zelle note
            </p>
          </div>
        </div>

        {/* Status */}
        {status === "pending" && (
          <div className="bg-yellow-400/20 rounded-2xl p-4 flex items-center gap-3">
            <Clock size={20} color="white" />
            <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Verifying your transfer...</p>
          </div>
        )}

        {/* Steps */}
        <div className="bg-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
          <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Transfer Steps</p>
          {["Open your banking app or Zelle", `Send $${total} to phone or email above`, "Include 'PARKING' in the memo", "Tap confirm below — we'll verify"].map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white" style={{ fontSize: "10px", fontWeight: 700 }}>{i + 1}</span>
              </div>
              <p className="text-white/80" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", lineHeight: 1.5 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4" style={{ background: "#6D1ED4", maxWidth: "480px", margin: "0 auto" }}>
        <button
          onClick={handleConfirm}
          disabled={status === "pending"}
          className="w-full h-14 rounded-xl bg-white flex items-center justify-center active:opacity-90 transition-all disabled:opacity-60"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700, color: "#6D1ED4" }}
        >
          {status === "pending" ? "Verifying..." : "I've Sent the Transfer"}
        </button>
      </div>
    </div>
  );
}
