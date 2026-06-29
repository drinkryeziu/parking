import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
  onBack: () => void;
  onPay: () => void;
  total: number;
}

function QRCode({ size = 180 }: { size?: number }) {
  // Decorative QR-like grid pattern
  const cells: boolean[][] = [
    [1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,0,1,0,0,1,0,1,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0,0,1,0],
    [1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,1,1],
    [0,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,0,0,0],
    [1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,0,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,1,0],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,1,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,1,1,0,1,1],
  ];
  const cellSize = size / 20;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map((row, r) => row.map((cell, c) => cell ? (
        <rect key={`${r}-${c}`} x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize - 1} height={cellSize - 1} rx="1" fill="#00D64F" />
      ) : null))}
    </svg>
  );
}

export function CashAppPaymentScreen({ onBack, onPay, total }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#00D64F" }}>
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-black/20 text-white active:bg-black/30">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>Cash App</h1>
      </div>

      <div className="flex-1 px-6 flex flex-col items-center justify-center gap-6 pb-20">
        <div className="bg-white rounded-3xl w-24 h-24 flex items-center justify-center shadow-xl">
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
            <text x="7" y="30" fontSize="26" fontWeight="900" fill="#00D64F" fontFamily="sans-serif">$</text>
          </svg>
        </div>

        <div className="text-center">
          <p className="text-black/60 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Payment amount</p>
          <p className="text-black" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "64px", fontWeight: 700, lineHeight: 1 }}>${total}</p>
          <p className="text-black/50 mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>To: $SweetwaterParking</p>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-5 shadow-xl flex flex-col items-center gap-3">
          <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>Scan with Cash App camera</p>
          <QRCode size={160} />
          <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>or use Cashtag: $SweetwaterParking</p>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full h-14 rounded-xl bg-black flex items-center justify-center active:opacity-90 transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700, color: "#00D64F" }}
          >
            I've Sent the Payment
          </button>
        ) : (
          <button
            onClick={onPay}
            className="w-full h-14 rounded-xl bg-black flex items-center justify-center active:opacity-90 transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700, color: "white" }}
          >
            Confirm &amp; Get Booking Code
          </button>
        )}
      </div>
    </div>
  );
}
