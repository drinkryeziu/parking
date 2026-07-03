import { useState } from "react";
import { ChevronDown, Calendar, Clock, ArrowLeft, MapPin } from "lucide-react";
import { api } from "../../lib/api";
import { AuthUser } from "../../lib/auth";

interface BookingData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  trailerType: string;
  trailerNumber: string;
  licensePlate: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  smsConfirmation: boolean;
  emailInvoice: boolean;
}

interface Props {
  onBack: () => void;
  onContinue: (data: BookingData, bookingId: string) => void;
  authUser?: AuthUser | null;
  token?: string | null;
}

type ErrorMap = Partial<Record<keyof BookingData, string>>;

const trailerTypes = [
  "53ft Dry Van",
  "48ft Dry Van",
  "53ft Reefer",
  "48ft Reefer",
  "Flatbed",
  "Step Deck",
  "Lowboy",
  "Tanker",
  "Intermodal Container",
  "Car Hauler",
  "Oversized Load",
];

const RATE_PER_DAY = 15;

function calcSummary(startDate: string, startTime: string, endDate: string, endTime: string) {
  if (!startDate || !startTime || !endDate || !endTime) return null;
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return null;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationLabel = days > 0 ? `${days}d ${hours}h ${mins}m` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return { durationLabel, total: totalDays * RATE_PER_DAY, days: totalDays };
}

function validate(data: BookingData): ErrorMap {
  const e: ErrorMap = {};
  if (!data.firstName.trim()) e.firstName = "Required";
  if (!data.lastName.trim()) e.lastName = "Required";
  if (!data.phone.trim()) e.phone = "Required";
  if (!data.email.trim()) e.email = "Required";
  if (!data.companyName.trim()) e.companyName = "Required";
  if (!data.trailerType) e.trailerType = "Please select a trailer type";
  if (!data.trailerNumber.trim()) e.trailerNumber = "Required";
  if (!data.licensePlate.trim()) e.licensePlate = "Required";
  if (!data.startDate) e.startDate = "Required";
  if (!data.startTime) e.startTime = "Required";
  if (!data.endDate) e.endDate = "Required";
  if (!data.endTime) e.endTime = "Required";
  if (data.startDate && data.startTime && data.endDate && data.endTime) {
    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);
    if (end <= start) e.endDate = "Departure must be after arrival";
  }
  return e;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>{msg}</p>;
}

function inputClass(error?: string) {
  return `w-full h-14 px-4 rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${
    error
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
  }`;
}

export function BookingFormScreen({ onBack, onContinue, authUser, token }: Props) {
  const [submittingApi, setSubmittingApi] = useState(false);
  const [apiError, setApiError] = useState("");

  const [data, setData] = useState<BookingData>({
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    phone: "",
    email: authUser?.email || "",
    companyName: "",
    trailerType: "",
    trailerNumber: "",
    licensePlate: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    smsConfirmation: true,
    emailInvoice: true,
  });
  const [showTrailerPicker, setShowTrailerPicker] = useState(false);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof BookingData, v: string | boolean) => {
    const next = { ...data, [k]: v };
    setData(next);
    if (submitted) setErrors(validate(next));
  };

  const summary = calcSummary(data.startDate, data.startTime, data.endDate, data.endTime);

  const handleContinue = async () => {
    setSubmitted(true);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmittingApi(true);
    setApiError("");
    try {
      const summary = calcSummary(data.startDate, data.startTime, data.endDate, data.endTime);
      const result = await api.post("/api/bookings", {
        ...data,
        startDate: `${data.startDate}T${data.startTime}`,
        endDate: `${data.endDate}T${data.endTime}`,
        totalAmount: summary?.total ?? 150,
        paymentMethod: "pending",
      }, token ?? undefined);
      onContinue(data, result.bookingId);
    } catch (err: any) {
      setApiError(err.message || "Failed to save booking");
      setSubmittingApi(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "26px", fontWeight: 700, color: "#007AFF", lineHeight: 1 }}>PARKING</h1>
          <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Booking Information</p>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
          <MapPin size={12} color="#007AFF" />
          <span className="text-blue-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Sweetwater Lot A</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-5 pb-32">

        {/* Driver Info */}
        <section>
          <p className="text-gray-400 mb-3 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>Driver Info</p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>First Name</label>
                <input
                  value={data.firstName}
                  onChange={e => set("firstName", e.target.value)}
                  placeholder="John"
                  className={inputClass(errors.firstName)}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                />
                <FieldError msg={errors.firstName} />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Last Name</label>
                <input
                  value={data.lastName}
                  onChange={e => set("lastName", e.target.value)}
                  placeholder="Smith"
                  className={inputClass(errors.lastName)}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
                />
                <FieldError msg={errors.lastName} />
              </div>
            </div>

            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Phone Number</label>
              <input
                value={data.phone}
                onChange={e => set("phone", e.target.value)}
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={inputClass(errors.phone)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
              <FieldError msg={errors.phone} />
            </div>

            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Email Address</label>
              <input
                value={data.email}
                onChange={e => set("email", e.target.value)}
                type="email"
                placeholder="john@example.com"
                className={inputClass(errors.email)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
              <FieldError msg={errors.email} />
            </div>
          </div>
        </section>

        {/* Trailer Info */}
        <section>
          <p className="text-gray-400 mb-3 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>Trailer Info</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Company Name on Trailer</label>
              <input
                value={data.companyName}
                onChange={e => set("companyName", e.target.value)}
                placeholder="Max Carriers Inc."
                className={inputClass(errors.companyName)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
              <FieldError msg={errors.companyName} />
            </div>

            {/* Trailer Type dropdown */}
            <div className="relative">
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Trailer Type</label>
              <button
                onClick={() => setShowTrailerPicker(!showTrailerPicker)}
                className={`w-full h-14 px-4 rounded-xl border bg-gray-50 text-left flex items-center justify-between transition-all ${
                  errors.trailerType ? "border-red-400" : "border-gray-200"
                }`}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: data.trailerType ? "#111" : "#9CA3AF" }}>
                  {data.trailerType || "Select trailer type"}
                </span>
                <ChevronDown size={20} color="#9CA3AF" className={`transition-transform ${showTrailerPicker ? "rotate-180" : ""}`} />
              </button>
              <FieldError msg={errors.trailerType} />
              {showTrailerPicker && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden max-h-56 overflow-y-auto">
                  {trailerTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => { set("trailerType", t); setShowTrailerPicker(false); }}
                      className={`w-full px-4 py-3.5 text-left border-b border-gray-50 last:border-0 ${data.trailerType === t ? "bg-blue-50 text-blue-600" : "text-gray-800 active:bg-gray-50"}`}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: data.trailerType === t ? 600 : 400 }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Trailer #</label>
              <input
                value={data.trailerNumber}
                onChange={e => set("trailerNumber", e.target.value)}
                placeholder="24200"
                className={inputClass(errors.trailerNumber)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
              <FieldError msg={errors.trailerNumber} />
            </div>

            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Trailer Plate</label>
              <input
                value={data.licensePlate}
                onChange={e => set("licensePlate", e.target.value)}
                placeholder="964800ST"
                className={inputClass(errors.licensePlate)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
              />
              <FieldError msg={errors.licensePlate} />
            </div>
          </div>
        </section>

        {/* Dates & Times */}
        <section>
          <p className="text-gray-400 mb-3 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>Reservation Period</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Arrival</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Calendar size={16} color={errors.startDate ? "#F87171" : "#007AFF"} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={data.startDate}
                    onChange={e => set("startDate", e.target.value)}
                    className={`w-full h-14 pl-9 pr-3 rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${errors.startDate ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}
                  />
                </div>
                <div className="relative w-32">
                  <Clock size={16} color={errors.startTime ? "#F87171" : "#007AFF"} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    value={data.startTime}
                    onChange={e => set("startTime", e.target.value)}
                    className={`w-full h-14 pl-9 pr-2 rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${errors.startTime ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                  />
                </div>
              </div>
              {(errors.startDate || errors.startTime) && (
                <p className="text-red-500 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                  {errors.startDate || errors.startTime}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-500 mb-1 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>Departure</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Calendar size={16} color={errors.endDate ? "#F87171" : "#007AFF"} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={data.endDate}
                    onChange={e => set("endDate", e.target.value)}
                    className={`w-full h-14 pl-9 pr-3 rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${errors.endDate ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}
                  />
                </div>
                <div className="relative w-32">
                  <Clock size={16} color={errors.endTime ? "#F87171" : "#007AFF"} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    value={data.endTime}
                    onChange={e => set("endTime", e.target.value)}
                    className={`w-full h-14 pl-9 pr-2 rounded-xl border bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${errors.endTime ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                  />
                </div>
              </div>
              {(errors.endDate || errors.endTime) && (
                <p className="text-red-500 mt-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                  {errors.endDate || errors.endTime}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Reservation Summary — appears only when all date/time fields are filled */}
        {summary && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-blue-100">
              <p className="text-blue-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}>RESERVATION SUMMARY</p>
            </div>
            <div className="px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock size={18} color="#3B82F6" className="flex-shrink-0" />
                <div>
                  <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>DURATION</p>
                  <p className="text-gray-900" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, lineHeight: 1.1 }}>{summary.durationLabel}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-blue-200" />
              <div className="text-right">
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600 }}>TOTAL</p>
                <p className="text-blue-600" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, lineHeight: 1.1 }}>${summary.total}</p>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px" }}>${RATE_PER_DAY}/day × {summary.days}d</p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <section>
          <p className="text-gray-400 mb-3 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700 }}>Notifications</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => set("smsConfirmation", !data.smsConfirmation)} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 transition-all">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${data.smsConfirmation ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                {data.smsConfirmation && <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className="text-left">
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Booking confirmation by SMS</p>
                <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Receive a text message with your booking details</p>
              </div>
            </button>
            <button onClick={() => set("emailInvoice", !data.emailInvoice)} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100 transition-all">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${data.emailInvoice ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                {data.emailInvoice && <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className="text-left">
                <p className="text-gray-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}>Invoice by Email</p>
                <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>Receive invoice PDF in your inbox</p>
              </div>
            </button>
          </div>
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
          onClick={handleContinue}
          disabled={submittingApi}
          className="w-full h-14 rounded-xl text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: "#007AFF", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          {submittingApi ? (
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : "Continue"}
        </button>
      </div>
    </div>
  );
}
