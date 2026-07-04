import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { CreateAccountScreen } from "./components/CreateAccountScreen";
import { BookingFormScreen } from "./components/BookingFormScreen";
import { BookingSummaryScreen } from "./components/BookingSummaryScreen";
import { CardPaymentScreen } from "./components/CardPaymentScreen";
import { VenmoPaymentScreen } from "./components/VenmoPaymentScreen";
import { CashAppPaymentScreen } from "./components/CashAppPaymentScreen";
import { ZellePaymentScreen } from "./components/ZellePaymentScreen";
import { ConfirmationScreen } from "./components/ConfirmationScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { getToken, getUser, setToken, setUser, clearToken, AuthUser, Profile } from "../lib/auth";
import { api } from "../lib/api";

type Screen =
  | "login"
  | "create-account"
  | "booking-form"
  | "booking-summary"
  | "payment-credit"
  | "payment-debit"
  | "payment-venmo"
  | "payment-cashapp"
  | "payment-zelle"
  | "confirmation"
  | "profile";

interface BookingData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  trailerType?: string;
  trailerNumber?: string;
  licensePlate?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  smsConfirmation?: boolean;
  emailInvoice?: boolean;
}

const DAYS_RATE = 15;

function calcTotal(startDate?: string, startTime?: string, endDate?: string, endTime?: string) {
  if (!startDate || !startTime || !endDate || !endTime) return 150;
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return days * DAYS_RATE;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(getToken);
  const [authUser, setAuthUser] = useState<AuthUser | null>(getUser);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Load saved profile whenever we have a token (fresh login or returning session).
  function loadProfile(token: string) {
    api.get("/api/profile", token)
      .then((p: Profile) => setProfile(p))
      .catch(() => setProfile(null));
  }

  useEffect(() => {
    if (authToken) {
      loadProfile(authToken);
      setScreen("booking-form");
    }
  }, []);

  const total = calcTotal(bookingData.startDate, bookingData.startTime, bookingData.endDate, bookingData.endTime);

  function handleAuthSuccess(token: string, user: AuthUser) {
    setToken(token);
    setUser(user);
    setAuthToken(token);
    setAuthUser(user);
    loadProfile(token);
    setScreen("booking-form");
  }

  function handleGuest() {
    setProfile(null);
    setScreen("booking-form");
  }

  function handleLogout() {
    clearToken();
    setAuthToken(null);
    setAuthUser(null);
    setProfile(null);
    setScreen("login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative">
        {screen === "login" && (
          <LoginScreen
            onAuthSuccess={handleAuthSuccess}
            onGuest={handleGuest}
            onCreateAccount={() => setScreen("create-account")}
          />
        )}
        {screen === "create-account" && (
          <CreateAccountScreen
            onBack={() => setScreen("login")}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
        {screen === "booking-form" && (
          <BookingFormScreen
            onBack={authToken ? handleLogout : () => setScreen("login")}
            authUser={authUser}
            profile={profile}
            token={authToken}
            onOpenProfile={authToken ? () => setScreen("profile") : undefined}
            onProfileSaved={(p) => setProfile(p)}
            onContinue={(data, id) => {
              setBookingData(data);
              setBookingId(id);
              setScreen("booking-summary");
            }}
          />
        )}
        {screen === "profile" && (
          <ProfileScreen
            onBack={() => setScreen("booking-form")}
            token={authToken}
            initialProfile={profile}
            onSaved={(p) => setProfile(p)}
          />
        )}
        {screen === "booking-summary" && (
          <BookingSummaryScreen
            onBack={() => setScreen("booking-form")}
            onContinue={(method) => {
              if (method === "credit") setScreen("payment-credit");
              else if (method === "debit") setScreen("payment-debit");
              else if (method === "venmo") setScreen("payment-venmo");
              else if (method === "cashapp") setScreen("payment-cashapp");
              else setScreen("payment-zelle");
            }}
            bookingData={bookingData}
          />
        )}
        {(screen === "payment-credit" || screen === "payment-debit") && (
          <CardPaymentScreen
            onBack={() => setScreen("booking-summary")}
            onPay={() => setScreen("confirmation")}
            total={total}
            type={screen === "payment-credit" ? "credit" : "debit"}
            bookingId={bookingId}
            token={authToken}
          />
        )}
        {screen === "payment-venmo" && (
          <VenmoPaymentScreen onBack={() => setScreen("booking-summary")} onPay={() => setScreen("confirmation")} total={total} />
        )}
        {screen === "payment-cashapp" && (
          <CashAppPaymentScreen onBack={() => setScreen("booking-summary")} onPay={() => setScreen("confirmation")} total={total} />
        )}
        {screen === "payment-zelle" && (
          <ZellePaymentScreen onBack={() => setScreen("booking-summary")} onPay={() => setScreen("confirmation")} total={total} />
        )}
        {screen === "confirmation" && (
          <ConfirmationScreen
            bookingData={bookingData}
            onNewBooking={() => { setBookingData({}); setBookingId(null); setScreen("booking-form"); }}
          />
        )}
      </div>
    </div>
  );
}
