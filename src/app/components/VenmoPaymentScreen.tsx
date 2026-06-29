import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface Props {
  onBack: () => void;
  onPay: () => void;
  total: number;
}

export function VenmoPaymentScreen({ onBack, onPay, total }: Props) {
  const [processing, setProcessing] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const handleOpenVenmo = () => {
    setRedirected(true);
    setProcessing(true);
    setTimeout(() => { setProcessing(false); }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#008CFF" }}>
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white active:bg-white/30">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>Venmo</h1>
      </div>

      <div className="flex-1 px-6 flex flex-col items-center justify-center gap-6 pb-20">
        {/* Logo */}
        <div className="bg-white rounded-3xl w-24 h-24 flex items-center justify-center shadow-xl">
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
            <text x="5" y="30" fontSize="28" fontWeight="900" fill="#008CFF" fontFamily="sans-serif">V</text>
          </svg>
        </div>

        <div className="text-center">
          <p className="text-white/70 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Payment amount</p>
          <p className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "64px", fontWeight: 700, lineHeight: 1 }}>${total}</p>
          <p className="text-white/60 mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Sweetwater Parking</p>
        </div>

        {/* Instructions */}
        <div className="bg-white/15 rounded-2xl p-5 w-full backdrop-blur-sm">
          <p className="text-white mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>How to pay with Venmo</p>
          {["Tap the button below to open Venmo", "Search for @SweetwaterParking", `Send $${total} with note: PARKING-BOOKING`, "Return here after payment to confirm"].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>{i + 1}</span>
              </div>
              <p className="text-white/80" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.5 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Open Venmo */}
        {!redirected ? (
          <button
            onClick={handleOpenVenmo}
            className="w-full h-14 rounded-xl bg-white flex items-center justify-center gap-2 active:opacity-90 transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700, color: "#008CFF" }}
          >
            <ExternalLink size={18} />
            Open Venmo App
          </button>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Venmo app opened — complete payment there</p>
            </div>
            <button
              onClick={onPay}
              className="w-full h-14 rounded-xl bg-white flex items-center justify-center active:opacity-90 transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700, color: "#008CFF" }}
            >
              I've Completed Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
