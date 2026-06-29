import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, X, Bell, BellOff, MessageSquare, Mail, Phone } from "lucide-react";

interface Props {
  bookingData?: {
    trailerType?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  };
}

const CODE = "5698";
const CONFIRMATION = "SWP-2026-48391";
const RATE_PER_DAY = 15;

function calcDays(startDate: string, startTime: string, endDate: string, endTime: string) {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function fmtDate(dateStr: string, timeStr: string) {
  const d = new Date(`${dateStr}T${timeStr}`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
    " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function fmtShort(dateStr: string, timeStr: string) {
  const d = new Date(`${dateStr}T${timeStr}`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ onClose, bookingData }: { onClose: () => void; bookingData: Props["bookingData"] }) {
  const d = bookingData || {};
  const startDate = d.startDate || "2026-06-06";
  const startTime = d.startTime || "10:30";
  const endDate = d.endDate || "2026-06-15";
  const endTime = d.endTime || "12:30";
  const days = calcDays(startDate, startTime, endDate, endTime);
  const total = days * RATE_PER_DAY;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-gray-900" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, color: "#007AFF" }}>Receipt</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 pb-4 border-b border-dashed border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <CheckCircle size={24} color="white" />
          </div>
          <p style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "20px", fontWeight: 700, color: "#007AFF" }}>SWEETWATER PARKING</p>
          <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Payment Receipt</p>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3">
          {[
            { label: "Receipt No.", value: "RCP-2026-48391" },
            { label: "Date", value: fmtShort(startDate, startTime).split(" · ")[0] },
            { label: "Confirmation", value: CONFIRMATION },
            { label: "Location", value: "Sweetwater Parking — Lot A" },
            { label: "Trailer Type", value: d.trailerType || "53ft Dry Van" },
            { label: "Check-in", value: fmtShort(startDate, startTime) },
            { label: "Check-out", value: fmtShort(endDate, endTime) },
            { label: "Duration", value: `${days} day${days > 1 ? "s" : ""}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4 py-2 border-b border-gray-50">
              <span className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{label}</span>
              <span className="text-gray-800 text-right" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Subtotal ({days}d × ${RATE_PER_DAY})</span>
            <span className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>${total}.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Tax (0%)</span>
            <span className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>$0.00</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 mt-1">
            <span className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700 }}>Total Paid</span>
            <span style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "20px", fontWeight: 700, color: "#007AFF" }}>${total}.00</span>
          </div>
        </div>

        <p className="text-center text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
          Thank you for choosing Sweetwater Parking.{"\n"}For questions call +1 (555) 847-2390
        </p>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="w-full h-14 rounded-xl text-white"
          style={{ background: "#007AFF", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Invoice Modal ─────────────────────────────────────────────────────────────
function InvoiceModal({ onClose, bookingData }: { onClose: () => void; bookingData: Props["bookingData"] }) {
  const d = bookingData || {};
  const startDate = d.startDate || "2026-06-06";
  const startTime = d.startTime || "10:30";
  const endDate = d.endDate || "2026-06-15";
  const endTime = d.endTime || "12:30";
  const days = calcDays(startDate, startTime, endDate, endTime);
  const total = days * RATE_PER_DAY;
  const dueDate = new Date(`${endDate}T${endTime}`);
  dueDate.setDate(dueDate.getDate() + 30);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, color: "#007AFF" }}>Invoice</h2>
        <div className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700 }}>PAID</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
        {/* From / To */}
        <div className="flex gap-4">
          <div className="flex-1 bg-blue-50 rounded-2xl p-4">
            <p className="text-blue-400 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em" }}>FROM</p>
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Sweetwater Parking LLC</p>
            <p className="text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: 1.6 }}>1200 Truck Stop Blvd{"\n"}Sweetwater, TX 79556{"\n"}+1 (555) 847-2390</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em" }}>BILL TO</p>
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Driver</p>
            <p className="text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: 1.6 }}>{d.trailerType || "53ft Dry Van"}</p>
          </div>
        </div>

        {/* Invoice meta */}
        <div className="flex flex-col gap-2">
          {[
            { label: "Invoice No.", value: "INV-2026-48391" },
            { label: "Issue Date", value: fmtShort(startDate, startTime).split(" · ")[0] },
            { label: "Due Date", value: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            { label: "Status", value: "Paid" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{label}</span>
              <span className={`text-right font-medium ${value === "Paid" ? "text-green-600" : "text-gray-800"}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Line item */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-50 px-4 py-2.5">
            {["Description", "Qty", "Rate", "Amount"].map(h => (
              <span key={h} className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>{h}</span>
            ))}
          </div>
          <div className="grid grid-cols-4 px-4 py-3.5 border-t border-gray-100">
            <span className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>Parking — Lot A</span>
            <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{days}d</span>
            <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>${RATE_PER_DAY}</span>
            <span className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>${total}</span>
          </div>
        </div>

        {/* Total block */}
        <div className="bg-blue-600 rounded-2xl px-5 py-4 flex justify-between items-center">
          <span className="text-white/80" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Total Paid</span>
          <span className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700 }}>${total}.00</span>
        </div>

        <p className="text-center text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
          This invoice is auto-generated. For disputes contact billing@sweetwaterparking.com
        </p>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="w-full h-14 rounded-xl text-white"
          style={{ background: "#007AFF", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Elapsed Timer ─────────────────────────────────────────────────────────────
function useElapsed(startDate: string, startTime: string) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = new Date(`${startDate}T${startTime}`).getTime();
    const tick = () => setElapsed(Math.max(0, Date.now() - start));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate, startTime]);
  return elapsed;
}

function fmtElapsed(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return { d, h, m, s };
  return { d: 0, h, m, s };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-600 rounded-xl px-3 py-2 min-w-[52px] text-center">
        <span className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700, lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>{label}</span>
    </div>
  );
}

type NotifMethod = "sms" | "email" | "push";
type NotifMethods = Set<NotifMethod>;

const NOTIF_ALERTS = [
  { key: "1d", label: "1 day before" },
  { key: "6h", label: "6 hours before" },
  { key: "1h", label: "1 hour before" },
  { key: "30m", label: "30 min before" },
] as const;

// ── Active Booking Screen ─────────────────────────────────────────────────────
function ActiveBookingScreen({ bookingData }: { bookingData: Props["bookingData"] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const d = bookingData || {};
  const startDate = d.startDate || "2026-06-06";
  const startTime = d.startTime || "10:30";
  const endDate = d.endDate || "2026-06-15";
  const endTime = d.endTime || "12:30";

  const elapsedMs = useElapsed(startDate, startTime);
  const totalMs = new Date(`${endDate}T${endTime}`).getTime() - new Date(`${startDate}T${startTime}`).getTime();
  const remainMs = Math.max(0, totalMs - elapsedMs);
  const progress = Math.min(1, elapsedMs / totalMs);

  const { d: remDays, h: remH, m: remM, s: remS } = fmtElapsed(remainMs);
  const remainDays = Math.floor(remainMs / 86400000);
  const remainHours = Math.floor((remainMs % 86400000) / 3600000);
  const remainMins = Math.floor((remainMs % 3600000) / 60000);
  const barColor = progress > 0.85 ? "#EF4444" : progress > 0.6 ? "#F97316" : "#007AFF";

  const [alerts, setAlerts] = useState<Record<string, boolean>>({ "1d": true, "6h": true, "1h": false, "30m": false });
  const [methods, setMethods] = useState<NotifMethods>(new Set<NotifMethod>(["sms"]));
  const toggleMethod = (m: NotifMethod) =>
    setMethods(prev => { const next = new Set(prev); next.has(m) ? next.delete(m) : next.add(m); return next; });
  const toggleAlert = (key: string) => setAlerts(prev => ({ ...prev, [key]: !prev[key] }));

  const remainLabel = remainDays > 0
    ? `${remainDays}d ${remainHours}h remaining`
    : remainHours > 0
    ? `${remainHours}h ${remainMins}m remaining`
    : remainMins > 0
    ? `${remainMins}m remaining`
    : "Ending soon";

  // Dismissed entirely — render nothing
  if (dismissed) return null;

  // Collapsed → compact notification card
  if (collapsed) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-end pb-6 px-4">
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          {/* Card body */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}>ACTIVE BOOKING · {CONFIRMATION}</p>
                <p className="text-gray-900 mt-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700 }}>Sweetwater — Lot A</p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:bg-gray-200 flex-shrink-0 ml-2"
              >
                <X size={14} />
              </button>
            </div>

            {/* Remaining time */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-end gap-1.5">
                {remDays > 0 && <><TimeBlock value={remDays} label="DAYS" /><span className="text-blue-400 pb-3" style={{ fontSize: "18px", fontWeight: 700 }}>:</span></>}
                <TimeBlock value={remH} label="HRS" />
                <span className="text-blue-400 pb-3" style={{ fontSize: "18px", fontWeight: 700 }}>:</span>
                <TimeBlock value={remM} label="MIN" />
                <span className="text-blue-400 pb-3" style={{ fontSize: "18px", fontWeight: 700 }}>:</span>
                <TimeBlock value={remS} label="SEC" />
              </div>
              <span className="text-gray-400 flex-1 text-right" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{remainLabel}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress * 100}%`, background: barColor }} />
            </div>
          </div>

          {/* Footer — gate code */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-blue-50">
            <p className="text-blue-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}>GATE ACCESS CODE</p>
            <p style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>{CODE}</p>
          </div>
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-8">
      {/* Header */}
      <div className="bg-blue-600 px-5 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 mb-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>ACTIVE BOOKING</p>
            <h1 className="text-white mb-0.5" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "28px", fontWeight: 700, lineHeight: 1 }}>
              Sweetwater — Lot A
            </h1>
            <p className="text-blue-200" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{CONFIRMATION}</p>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-all flex-shrink-0"
          >
            <X size={18} color="white" />
          </button>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4 -mt-2">
        {/* Remaining Timer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-gray-400 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}>TIME REMAINING</p>
            <div className="flex items-end gap-2 justify-center mb-4">
              {remDays > 0 && <><TimeBlock value={remDays} label="DAYS" /><span className="text-blue-400 pb-3" style={{ fontSize: "22px", fontWeight: 700 }}>:</span></>}
              <TimeBlock value={remH} label="HRS" />
              <span className="text-blue-400 pb-3" style={{ fontSize: "22px", fontWeight: 700 }}>:</span>
              <TimeBlock value={remM} label="MIN" />
              <span className="text-blue-400 pb-3" style={{ fontSize: "22px", fontWeight: 700 }}>:</span>
              <TimeBlock value={remS} label="SEC" />
            </div>

            {/* Progress bar — shows how much time has passed */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(1 - progress) * 100}%`, background: barColor }} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{fmtShort(startDate, startTime)}</span>
              <span className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>{fmtShort(endDate, endTime)}</span>
            </div>
          </div>
          <div className="border-t border-blue-100 px-4 py-2.5 flex items-center justify-center" style={{ background: barColor === "#EF4444" ? "#FEF2F2" : "#EFF6FF" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: barColor }}>{remainLabel}</span>
          </div>
        </div>

        {/* Gate code */}
        <div className="bg-white rounded-2xl border border-blue-100 px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-0.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>GATE ACCESS CODE</p>
            <p style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "40px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>{CODE}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              {[[1,1,1,0,1,1,1],[1,0,1,0,1,0,1],[1,0,1,0,1,0,1],[0,0,0,0,0,0,0],[1,0,1,0,1,0,1],[1,0,1,0,1,0,1],[1,1,1,0,1,1,1]].map((row,r)=>row.map((c,col)=>c?(
                <rect key={`${r}-${col}`} x={col*8+2} y={r*8+2} width="7" height="7" rx="1" fill="#007AFF"/>
              ):null))}
            </svg>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-gray-50 flex items-center gap-2">
            <Bell size={16} color="#007AFF" />
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 700 }}>Expiry Reminders</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {NOTIF_ALERTS.map(({ key, label }) => (
              <button key={key} onClick={() => toggleAlert(key)} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${alerts[key] ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                    {alerts[key] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className={alerts[key] ? "text-gray-800" : "text-gray-400"} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: alerts[key] ? 500 : 400 }}>{label}</span>
                </div>
                {alerts[key] ? <Bell size={14} color="#007AFF" /> : <BellOff size={14} color="#D1D5DB" />}
              </button>
            ))}
          </div>
          <div className="px-4 pb-4 pt-1 border-t border-gray-50">
            <p className="text-gray-400 mb-2.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>NOTIFY VIA</p>
            <div className="flex gap-2">
              {([
                { id: "sms", icon: <Phone size={14} />, label: "SMS" },
                { id: "email", icon: <Mail size={14} />, label: "Email" },
                { id: "push", icon: <MessageSquare size={14} />, label: "Push" },
              ] as { id: NotifMethod; icon: React.ReactNode; label: string }[]).map(opt => (
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
      </div>
    </div>
  );
}

// ── QR Code ───────────────────────────────────────────────────────────────────
function QRCode({ size = 160 }: { size?: number }) {
  const cells: boolean[][] = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0],
    [1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,1,0,0,1],
    [0,1,0,1,0,0,0,1,1,0,0,1,0,0,0,1,0,1,1,0],
    [1,0,0,1,1,0,1,0,0,1,1,0,1,1,1,0,0,1,0,1],
    [0,1,1,0,0,1,0,1,0,0,0,1,0,1,0,0,1,0,1,0],
    [1,0,0,1,0,0,1,0,1,0,0,1,1,0,1,1,0,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,1,1,0,0,0,1,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,0,0,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,0,1,1],
  ];
  const cellSize = size / 20;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map((row, r) => row.map((cell, c) => cell ? (
        <rect key={`${r}-${c}`} x={c * cellSize + 1} y={r * cellSize + 1} width={cellSize - 1} height={cellSize - 1} rx="1" fill="#007AFF" />
      ) : null))}
    </svg>
  );
}

// ── Main Confirmation Screen ──────────────────────────────────────────────────
export function ConfirmationScreen({ bookingData }: Props) {
  const [modal, setModal] = useState<"receipt" | "invoice" | null>(null);
  const [done, setDone] = useState(false);

  const d = bookingData || {};
  const startDate = d.startDate || "2026-06-06";
  const startTime = d.startTime || "10:30";
  const endDate = d.endDate || "2026-06-15";
  const endTime = d.endTime || "12:30";

  if (modal === "receipt") return <ReceiptModal onClose={() => setModal(null)} bookingData={bookingData} />;
  if (modal === "invoice") return <InvoiceModal onClose={() => setModal(null)} bookingData={bookingData} />;
  if (done) return <ActiveBookingScreen bookingData={bookingData} />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Success header */}
      <div className="bg-blue-600 px-6 pt-12 pb-8 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
          <CheckCircle size={44} color="#007AFF" />
        </div>
        <div className="text-center">
          <h1 className="text-white" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "32px", fontWeight: 700, lineHeight: 1.1 }}>Booking Confirmed!</h1>
          <p className="text-blue-100 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Your parking spot is reserved</p>
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-2">
          <p className="text-white/70" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em" }}>CONFIRMATION</p>
          <p className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700, letterSpacing: "0.05em" }}>{CONFIRMATION}</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-8">
        {/* Gate Code */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 text-center">
          <p className="text-blue-500 mb-1" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "16px", fontWeight: 700, letterSpacing: "0.1em" }}>GATE ACCESS CODE</p>
          <p style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "80px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>{CODE}</p>
          <p className="text-blue-400 mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Use this code to open and close the gate</p>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3 shadow-sm">
          <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>SCAN FOR QUICK ACCESS</p>
          <QRCode size={160} />
          <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px" }}>Scan at the gate for instant entry</p>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-gray-50 bg-gray-50">
            <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Reservation Details</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            {[
              { label: "Location", value: "Sweetwater Parking — Lot A" },
              { label: "Trailer Type", value: d.trailerType || "53ft Dry Van" },
              { label: "Check-in", value: fmtShort(startDate, startTime) },
              { label: "Check-out", value: fmtShort(endDate, endTime) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-3">
                <span className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{label}</span>
                <span className="text-gray-800 text-right" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-800 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Important Instructions</p>
          <p className="text-amber-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: 1.6 }}>
            Use the code <strong>{CODE}</strong> displayed on screen to open the gate when arriving. After entering, please close the gate. Use the same code when exiting.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setModal("receipt")}
            className="h-14 rounded-xl border-2 border-blue-200 bg-blue-50 flex items-center justify-center gap-2 active:bg-blue-100 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
            <span className="text-blue-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Receipt</span>
          </button>
          <button
            onClick={() => setModal("invoice")}
            className="h-14 rounded-xl border-2 border-blue-200 bg-blue-50 flex items-center justify-center gap-2 active:bg-blue-100 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span className="text-blue-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Invoice</span>
          </button>
        </div>

        {/* Done */}
        <button
          onClick={() => setDone(true)}
          className="w-full h-14 rounded-xl text-white active:scale-[0.98] transition-all"
          style={{ background: "#007AFF", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
