import React, { useState, useEffect } from "react";
import TransactionHistory from "../components/admin/TransactionHistory";
import AdminTabs from "../components/admin/AdminTabs";
import Games from "../components/admin/Games";
import Withdrawals from "../components/admin/Withdrawals";
import AdminController from "../components/admin/AdminController";
import GameRoundsTable from "../components/admin/GameRoundsTable";
import Deposite from "../components/admin/Deposite";
import AllUsers from "../components/admin/AllUsers";
import Telegram from "../components/admin/Telegram";
import QRCode from "../components/admin/QRCode";
import AddSpinnerPrizes from "../components/admin/AddSpinnerPrices";
import QRCodeCrypto from "../components/admin/QRCodeCrypto";
import ReferAmount from "../components/admin/ReferAmount";
import AdminForm from "../components/admin/addNotification";
import AddTelegramAmount from "../components/admin/AddTelegramAmount";
const Admin = () => {
  const [selectField, setSelectField] = useState("transaction");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex flex-col items-center">
      <AdminTabs selected={selectField} onSelect={setSelectField} />
      <div className="">
        {selectField === "All Users" && <AllUsers />}
        {selectField === "Transaction" && <TransactionHistory />}
        {selectField === "Deposite" && <Deposite />}
        {selectField === "Telegram Deposite" && <AddTelegramAmount />}
        {selectField === "Games" && <Games />}
        {selectField === "Withdrawals" && <Withdrawals />}
        {selectField === "Admin Controller" && <AdminController />}
        {selectField === "Telegram" && <Telegram />}
        {selectField === "Spinner Prices" && <AddSpinnerPrizes />}
        {selectField === "QRCode" && <QRCode />}
        {selectField === "QRCode Crypto" && <QRCodeCrypto />}
        {selectField === "Refer Amount" && <ReferAmount />}
        {selectField === "Notification" && <AdminForm />}
      </div>
    </div>
  );
};

export default Admin;
