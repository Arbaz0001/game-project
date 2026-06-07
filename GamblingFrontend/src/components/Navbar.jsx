import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import BalanceButton from "./BalanceButton";
import { Wallet, X } from "lucide-react";
import { ReferEarn } from "./ReferEarn";
import { HelpAndSupport } from "./HelpAndSupport";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const [games, setGames] = useState([]);
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/visible-games`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGames(data.data);
        }
      });
  }, []);

  const gameInfo = {
    chicken: {
      displayName: "Chicken Escape",
      image: "/header.png",
      link: "/chicken-road",
    },
    mining: {
      displayName: "Gold Miner Quest",
      image: "/header.png",
      link: "mines",
    },
    aviator: {
      displayName: "Aviator",
      image: "/header.png",
      link: "mines",
    },
    color: {
      displayName: "Color Trading",
      image: "/header.png",
      link: "mines",
    },
  };

  return (
    <nav className="bg-transparent w-full py-3 ">
      <div className="text-white flex justify-between items-center px-6 md:px-20">
        <div className="">LOGO</div>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <BalanceButton />
            <div
              className="p-2 bg-transparent shadow-xs shadow-[#9C1137] rounded block md:hidden"
              onClick={() => setOpen(!open)}
            >
              <Wallet size={24} color="#f5c14f" />
            </div>
            <div className="md:flex hidden gap-4">
              <Link to={"/deposite"}>
                <Button
                  children="Deposite"
                  className="bg-gradient-to-b from-[#9C1137] via-[#9C1137]  to-black"
                />
              </Link>
              <Link to={"/withdraw"}>
                <Button
                  children="Withdraw"
                  className="bg-transparent shadow-xs shadow-[#9C1137] hover:bg-transparent"
                />
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative cursor-pointer h-10 w-10 flex justify-center items-center rounded-full bg-transparent text-amber-200 text-xl font-medium z-50 shadow-xs shadow-[#9C1137]">
                  {user.fullName[0]}
                </MenuButton>
              </div>
              {/* 
              <Transition
                enter="transition-transform transition-opacity duration-300 ease-out"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition-transform transition-opacity duration-300 ease-in"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
              > */}
              <Transition
                enter="transition-transform transition-opacity duration-300 ease-out"
                enterFrom="-translate-x-full opacity-0" // start from left
                enterTo="translate-x-0 opacity-100" // slide in to center
                leave="transition-transform transition-opacity duration-300 ease-in"
                leaveFrom="translate-x-0 opacity-100" // start at center
                leaveTo="-translate-x-full opacity-0" // exit to left
              >
                <MenuItems className="fixed top-0 left-0 z-100 h-screen overflow-y-auto w-64 md:w-64 sm:w-full transform bg-[#160003] focus:outline-none pt-4">
                  <span className="block px-4 py-2 text-sm cursor-pointer">
                    <p className="text-amber-200">{user.fullName}</p>
                    <p>
                      {user._id[0]}
                      {user._id[1]}*****{user._id[user._id.length - 1]}
                      {user._id[user._id.length - 2]}
                    </p>
                  </span>

                  {user?.role === "admin" && (
                    <MenuItem>
                      <a
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none"
                      >
                        Admin
                      </a>
                    </MenuItem>
                  )}

                  <a
                    href="/change-password"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    Change Password
                  </a>

                  {games.map((gameKey) => {
                    const info = gameInfo[gameKey];
                    if (!info) return null;

                    return (
                      <MenuItem key={info.displayName}>
                        <a
                          href={info.link}
                          className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none"
                        >
                          {info.displayName}
                        </a>
                      </MenuItem>
                    );
                  })}

                  <MenuItem>
                    <a
                      href="/transactions"
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none"
                    >
                      Transactions
                    </a>
                  </MenuItem>

                  <a
                    href="/spinner"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    Spinner
                  </a>

                  <a
                    href="/bets"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    All Bets
                  </a>

                  <a
                    href="/ranking"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    Ranking
                  </a>

                  {/* <a
                    href="/"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    Notification
                  </a> */}

                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setIsHelpOpen(true);
                    }}
                    href="/"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    Help & Support
                  </a>

                  <HelpAndSupport
                    isOpen={isHelpOpen}
                    onClose={() => setIsHelpOpen(false)}
                  />

                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setIsReferOpen(true);
                    }}
                    href="/"
                    className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                  >
                    Refer & Earn
                  </a>

                  {/* Global modal */}
                  <ReferEarn
                    isOpen={isReferOpen}
                    onClose={() => setIsReferOpen(false)}
                    userId="12345"
                  />
                  <MenuItem>
                    <a
                      onClick={logout}
                      className="block px-4 py-2 text-sm hover:shadow-xs shadow-red-500 focus:outline-none cursor-pointer"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          ) : (
            <>
              <Link to={"/login"}>
                <Button
                  children="Login"
                  className="bg-transparent shadow-xs shadow-[#9C1137]"
                />
              </Link>
              <Link to={"/signup"}>
                <Button
                  children="Register"
                  className="bg-gradient-to-b from-[#9C1137] via-[#9C1137]  to-black"
                />
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`${
          open ? "flex" : "hidden"
        } fixed top-0 left-0 z-50 w-screen h-screen bg-white/10 backdrop-blur-sm items-center justify-center`}
      >
        <div className="absolute w-full bg-[#160003] p-4 px-12 bottom-0">
          {/* Close Button */}
          <button
            className="z-50 text-gray-300 hover:text-red-500 transition right-4 absolute"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Menu Content */}
          <div className="p-6 text-center z-40 mt-12 text-white">
            <Link to={"deposite"}>
              <span className="block bg-gradient-to-b from-[#9C1137] via-[#9C1137]  to-black shadow-xs shadow-amber-50 py-2 rounded text-xl font-medium mb-4 cursor-pointer">
                Deposit
              </span>
            </Link>
            <Link
              to={"/withdraw"}
              className="block bg-transparent shadow-sm shadow-[#9C1137] py-2 text-amber-50 rounded text-xl font-medium mb-4 cursor-pointer"
            >
              Withdraw
            </Link>
            <Link
              to={"/transactions"}
              className="block bg-transparent shadow-sm shadow-[#9C1137]  py-2 text-white rounded text-xl font-medium cursor-pointer"
            >
              Transaction history
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
