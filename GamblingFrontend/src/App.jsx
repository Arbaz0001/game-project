import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChickenGame from "./pages/ChickenGame";
import Home from "./pages/Home";
import { BalanceProvider } from "./context/BalanceContext";
import PaymentSuccess from "./components/PaymentSuccess";
import { PrivateRoute } from "./components/PrivateRoute";
import Payment from "./pages/Payment";
import WithdrawalContainer from "./components/withdrawal/WithdrawalContainer";
import TransactionHistory from "./components/TransactionHistory";
import Admin from "./pages/Admin";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AviatorGameScreen from "./components/aviator/AviatorGameScreen";
import { SocketProvider } from "./context/SocketContext";
import Mines from "./pages/Mines";
import DepositFlow from "./components/DepositFlow";
import Color from "./pages/Color";
import { AviatorSocketProvider } from "./context/AviatorSocketContext";
import Spinner from "./components/Spinner";
import ChangePassword from "./components/ChangePassword";
import TelegramSubscription from "./components/TelegramSubscription";
import GameBets from "./components/admin/GameBets";
import RankingPage from "./components/RankingPage";
import QRCode from "./components/admin/QRCode";
import { ReferEarn } from "./components/ReferEarn";
import ProfilePage from "./components/withdrawal/ProfilePage";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  useEffect(() => {
    const isTokenExpired = (token) => {
      if (!token) return true;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        return decoded.exp < currentTime; // true if expired
      } catch (err) {
        return true; // Invalid token
      }
    };

    const token = localStorage.getItem("accessToken");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("accessToken"); // clear invalid/expired token
      localStorage.removeItem("user"); // clear invalid/expired token
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  return (
    <AuthProvider>
      <BalanceProvider>
        <BrowserRouter>
          <SocketProvider>
            <AviatorSocketProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/qr-code" element={<QRCode />} />
                <Route path="/" element={<Home />} />
                <Route path="/aviator" element={<AviatorGameScreen />} />
                <Route path="/mines" element={<Mines />} />
                <Route path="/spinner" element={<Spinner />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/color-trading" element={<Color />} />
                <Route path="/refer-earn" element={<ReferEarn />} />
                <Route
                  path="/telegram-subscription/:gameName"
                  element={<TelegramSubscription />}
                />
                <Route path="/bets" element={<GameBets userId={userId} />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* //private routes */}
                <Route
                  path="/withdraw"
                  element={<PrivateRoute children={<WithdrawalContainer />} />}
                />
                <Route
                  path="/deposite"
                  element={<PrivateRoute children={<DepositFlow />} />}
                />
                <Route
                  path="/transactions"
                  element={<PrivateRoute children={<TransactionHistory />} />}
                />
                <Route
                  path="/chicken-road"
                  element={<PrivateRoute children={<ChickenGame />} />}
                />
                <Route
                  path="/payment"
                  element={<PrivateRoute children={<Payment />} />}
                />
                <Route
                  path="/paymentsuccess"
                  element={<PrivateRoute children={<PaymentSuccess />} />}
                />
                <Route path="*" element={<div>404 - Not Found</div>} />
              </Routes>
              <ToastContainer />
            </AviatorSocketProvider>
          </SocketProvider>
        </BrowserRouter>
      </BalanceProvider>
    </AuthProvider>
  );
};

export default App;
