import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { CreateAccountScreen } from "./components/CreateAccountScreen";
import { BookingFormScreen } from "./components/BookingFormScreen";
import { BookingSummaryScreen } from "./components/BookingSummaryScreen";
import { CardPaymentScreen } from "./components/CardPaymentScreen";
import { VenmoPaymentScreen } from "./components/VenmoPaymentScreen";
import { CashAppPaymentScreen } from "./components/CashAppPaymentScreen";
import { ZellePaymentScreen } from "./components/ZellePaymentScreen";
import { ConfirmationScreen } from "./components/ConfirmationScreen";

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
  | "confirmation";

interface BookingData {
  firstName?: string;
  lastName?: string;
  trailerType?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
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

  const total = calcTotal(bookingData.startDate, bookingData.startTime, bookingData.endDate, bookingData.endTime);

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative">
        {screen === "login" && (
          <LoginScreen
            onLogin={() => setScreen("booking-form")}
            onGuest={() => setScreen("booking-form")}
            onCreateAccount={() => setScreen("create-account")}
          />
        )}
        {screen === "create-account" && (
          <CreateAccountScreen
            onBack={() => setScreen("login")}
            onSuccess={() => setScreen("booking-form")}
          />
        )}
        {screen === "booking-form" && (
          <BookingFormScreen
            onBack={() => setScreen("login")}
            onContinue={(data) => {
              setBookingData(data);
              setScreen("booking-summary");
            }}
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
          />
        )}
        {screen === "payment-venmo" && (
          <VenmoPaymentScreen
            onBack={() => setScreen("booking-summary")}
            onPay={() => setScreen("confirmation")}
            total={total}
          />
        )}
        {screen === "payment-cashapp" && (
          <CashAppPaymentScreen
            onBack={() => setScreen("booking-summary")}
            onPay={() => setScreen("confirmation")}
            total={total}
          />
        )}
        {screen === "payment-zelle" && (
          <ZellePaymentScreen
            onBack={() => setScreen("booking-summary")}
            onPay={() => setScreen("confirmation")}
            total={total}
          />
        )}
        {screen === "confirmation" && (
          <ConfirmationScreen bookingData={bookingData} />
        )}
      </div>
    </div>
  );
}
