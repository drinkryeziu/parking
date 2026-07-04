import { useState, useEffect } from "react";
import { ArrowLeft, User, Truck, CheckCircle } from "lucide-react";
import { api } from "../../lib/api";
import { Profile } from "../../lib/auth";

interface Props {
  onBack: () => void;
  token: string | null;
  initialProfile?: Profile | null;
  onSaved?: (p: Profile) => void;
}

const trailerTypes = [
  "53ft Dry Van", "48ft Dry Van", "53ft Reefer", "48ft Reefer", "Flatbed",
  "Step Deck", "Lowboy", "Tanker", "Intermodal Container", "Car Hauler", "Oversized Load",
];

const EMPTY: Profile = {
  firstName: "", lastName: "", email: "", phone: "",
  companyName: "", trailerType: "", trailerNumber: "", licensePlate: "",
};

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>{label}</label>
      <input
        value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
        className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px" }}
      />
    </div>
  );
}

export function ProfileScreen({ onBack, token, initialProfile, onSaved }: Props) {
  const [profile, setProfile] = useState<Profile>(initialProfile || EMPTY);
  const [original, setOriginal] = useState<Profile>(initialProfile || EMPTY);
  const [loading, setLoading] = useState(!initialProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showTrailerPicker, setShowTrailerPicker] = useState(false);

  useEffect(() => {
    if (initialProfile || !token) return;
    api.get("/api/profile", token)
      .then((p: Profile) => { setProfile(p); setOriginal(p); })
      .catch((e: any) => setError(e.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [token]);

  const set = (k: keyof Profile, v: string) => setProfile(prev => ({ ...prev, [k]: v }));
  const dirty = JSON.stringify(profile) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await api.put("/api/profile", profile, token ?? undefined);
      setProfile(updated);
      setOriginal(updated);
      onSaved?.(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setProfile(original); setError(""); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-gray-900" style={{ fontFamily: "'Advent Pro', sans-serif", fontVariationSettings: '"wdth" 100', fontSize: "22px", fontWeight: 700, color: "#007AFF" }}>My Profile</h2>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#024ad8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      ) : (
        <div className="flex-1 px-4 py-5 flex flex-col gap-4 pb-32">
          {/* Avatar */}
          <div className="flex flex-col items-center py-2">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-3">
              <span className="text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 700 }}>
                {(profile.firstName[0] || "").toUpperCase()}{(profile.lastName[0] || "").toUpperCase()}
              </span>
            </div>
            <p className="text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}>{profile.firstName} {profile.lastName}</p>
            <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{profile.email}</p>
          </div>

          {/* Personal */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <User size={14} color="#007AFF" />
              <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Personal Info</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1"><Field label="FIRST NAME" value={profile.firstName} onChange={v => set("firstName", v)} placeholder="John" /></div>
              <div className="flex-1"><Field label="LAST NAME" value={profile.lastName} onChange={v => set("lastName", v)} placeholder="Smith" /></div>
            </div>
            <Field label="PHONE" value={profile.phone} onChange={v => set("phone", v)} type="tel" placeholder="+1 (555) 000-0000" />
          </div>

          {/* Trailer */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Truck size={14} color="#007AFF" />
              <p className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700 }}>Trailer & Company</p>
            </div>
            <Field label="COMPANY NAME ON TRAILER" value={profile.companyName} onChange={v => set("companyName", v)} placeholder="Max Carriers Inc." />
            {/* Trailer type dropdown */}
            <div className="relative">
              <label className="text-gray-500 mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600 }}>TRAILER TYPE</label>
              <button
                onClick={() => setShowTrailerPicker(!showTrailerPicker)}
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-left flex items-center justify-between"
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: profile.trailerType ? "#111" : "#9CA3AF" }}>
                  {profile.trailerType || "Select trailer type"}
                </span>
              </button>
              {showTrailerPicker && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-20 max-h-56 overflow-y-auto">
                  {trailerTypes.map(t => (
                    <button key={t} onClick={() => { set("trailerType", t); setShowTrailerPicker(false); }}
                      className={`w-full px-4 py-3 text-left border-b border-gray-50 last:border-0 ${profile.trailerType === t ? "bg-blue-50 text-blue-600" : "text-gray-800 active:bg-gray-50"}`}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex-1"><Field label="TRAILER #" value={profile.trailerNumber} onChange={v => set("trailerNumber", v)} placeholder="24200" /></div>
              <div className="flex-1"><Field label="TRAILER PLATE" value={profile.licensePlate} onChange={v => set("licensePlate", v)} placeholder="964800ST" /></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              <p className="text-red-600" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>{error}</p>
            </div>
          )}
        </div>
      )}

      {/* CTA — Save + Cancel ghost link (only when there are unsaved changes) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <button
          onClick={handleSave}
          disabled={saving || (!dirty && !saved)}
          className="w-full h-14 rounded-xl text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: saved ? "#22C55E" : "#024ad8", fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 700 }}
        >
          {saving ? (
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : saved ? (<><CheckCircle size={18} /> Saved!</>) : "Save Changes"}
        </button>
        {dirty && !saving && (
          <button onClick={handleCancel} className="w-full mt-2 text-gray-500" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
