import { useState } from "react";
import { ArrowLeft, MapPin, Truck, Calendar, Clock, DollarSign } from "lucide-react";

type PaymentMethod = "credit" | "debit" | "venmo" | "cashapp" | "zelle";

interface Props {
  onBack: () => void;
  onContinue: (method: PaymentMethod) => void;
  bookingData?: {
    firstName?: string;
    lastName?: string;
    trailerType?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  };
}

const RATE_PER_DAY = 15;

function calcDays(startDate: string, startTime: string, endDate: string, endTime: string) {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

const PaymentCard = ({ id, selected, onClick, logo, name, color }: { id: string; selected: boolean; onClick: () => void; logo: React.ReactNode; name: string; color: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color }}>
      {logo}
    </div>
    <div className="text-left flex-1">
      <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600 }}>{name}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-blue-500" : "border-gray-300"}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
    </div>
  </button>
);

export function BookingSummaryScreen({ onBack, onContinue, bookingData }: Props) {
  const [selected, setSelected] = useState<PaymentMethod>("credit");

  const d = bookingData || {};
  const startDate = d.startDate || "2026-06-06";
  const startTime = d.startTime || "10:30";
  const endDate = d.endDate || "2026-06-15";
  const endTime = d.endTime || "12:30";
  const days = calcDays(startDate, startTime, endDate, endTime);
  const total = days * RATE_PER_DAY;

  const fmt = (dateStr: string, timeStr: string) => {
    const d = new Date(`${dateStr}T${timeStr}`);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>Summary & Payment</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-32">
        {/* Price Hero */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>TOTAL DUE</p>
              <p style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "56px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>${total}</p>
              <p className="text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>${RATE_PER_DAY}/day × {days} days</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <DollarSign size={24} color="#007AFF" />
            </div>
          </div>
        </div>

        {/* Reservation Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700 }}>Reservation Details</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={15} color="#007AFF" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>LOCATION</p>
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>Sweetwater Parking — Lot A</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck size={15} color="#007AFF" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>TRAILER TYPE</p>
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>{d.trailerType || "53ft Dry Van"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={15} color="#007AFF" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>CHECK-IN</p>
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>{fmt(startDate, startTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={15} color="#007AFF" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>CHECK-OUT</p>
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>{fmt(endDate, endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={15} color="#007AFF" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>DURATION</p>
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>{days} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <p className="text-gray-400 mb-3 uppercase tracking-widest px-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>Select Payment Method</p>
          <div className="flex flex-col gap-2">
            <PaymentCard
              id="credit"
              selected={selected === "credit"}
              onClick={() => setSelected("credit")}
              name="Credit Card"
              color="#1A1F36"
              logo={<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#1A1F36"/><rect y="4" width="24" height="4" fill="#F5A623"/><rect x="2" y="10" width="6" height="2" rx="1" fill="white"/></svg>}
            />
            <PaymentCard
              id="debit"
              selected={selected === "debit"}
              onClick={() => setSelected("debit")}
              name="Debit Card"
              color="#0D5C3D"
              logo={<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0D5C3D"/><rect y="4" width="24" height="4" fill="#48BB78"/><rect x="2" y="10" width="6" height="2" rx="1" fill="white"/></svg>}
            />
            <PaymentCard
              id="venmo"
              selected={selected === "venmo"}
              onClick={() => setSelected("venmo")}
              name="Venmo"
              color="#008CFF"
              logo={<svg width="22" height="22" viewBox="0 0 40 40" fill="none"><text x="5" y="30" fontSize="28" fontWeight="900" fill="white" fontFamily="sans-serif">V</text></svg>}
            />
            <PaymentCard
              id="cashapp"
              selected={selected === "cashapp"}
              onClick={() => setSelected("cashapp")}
              name="Cash App"
              color="#00D64F"
              logo={<svg width="22" height="22" viewBox="0 0 40 40" fill="none"><text x="7" y="30" fontSize="26" fontWeight="900" fill="white" fontFamily="sans-serif">$</text></svg>}
            />
            <PaymentCard
              id="zelle"
              selected={selected === "zelle"}
              onClick={() => setSelected("zelle")}
              name="Zelle"
              color="#6D1ED4"
              logo={<svg width="22" height="22" viewBox="0 0 40 40" fill="none"><text x="7" y="30" fontSize="26" fontWeight="900" fill="white" fontFamily="sans-serif">Z</text></svg>}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <button
          onClick={() => onContinue(selected)}
          className="w-full h-14 rounded-xl text-white transition-all active:scale-[0.98]"
          style={{ background: "#007AFF", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
