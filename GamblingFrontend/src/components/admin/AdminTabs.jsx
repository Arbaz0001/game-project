import { useEffect, useRef, useState } from "react";
import { getAdminAccessPages } from "../../services/adminAccessPages";
import { Menu, X } from "lucide-react";

const AdminTabs = ({ selected, onSelect }) => {
  const [methods, setAccessPages] = useState([
    "All Users",
    "Transaction",
    "Games",
    "Withdrawals",
    "Admin Controller",
    "Deposite",
    "Telegram Deposite",
    "Telegram",
    "QRCode",
    "QRCode Crypto",
    "Spinner Prices",
    "Refer Amount",
    "Notification",
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect(() => {
  //   const fetchAccess = async () => {
  //     try {
  //       const pages = await getAdminAccessPages();
  //       console.log("pages", pages);
  //       setAccessPages(pages);
  //     } catch (error) {
  //       // Optional: handle error
  //     }
  //   };

  //   fetchAccess();
  // }, []);
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);

  // auto-scroll selected into center
  useEffect(() => {
    const idx = methods.indexOf(selected);
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;

    // center the button in the container
    const left = btn.offsetLeft - (container.clientWidth - btn.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [selected, methods]);

  return (
    <div className="w-full">
      {/* Mobile Menu Icon */}
      <div className="flex items-center justify-between px-4 py-2 md:hidden border-b border-zinc-700">
        <h2 className="text-white font-semibold">Admin</h2>
        <button onClick={() => setIsMenuOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
          <h2 className="text-white font-semibold">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col px-4 py-2 space-y-2">
          {methods.map((method, index) => (
            <button
              key={`${method}-${index}`}
              onClick={() => {
                onSelect(method);
                setIsMenuOpen(false); // Close menu on selection
              }}
              className={`text-left py-2 px-2 rounded font-semibold transition ${
                selected === method
                  ? "bg-white text-black"
                  : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {method}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop Tabs */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto scroll-smooth "
        // keep -mx-4 only if you want the inner padding to visually align with page edges
      >
        {/* inner = actual row that grows (min-w-max here) */}
        <div className="md:flex hidden items-center space-x-4 min-w-max px-4 py-2 border-b border-zinc-700">
          {methods.map((method, i) => (
            <button
              key={`${method}-${i}`}
              ref={(el) => (buttonRefs.current[i] = el)}
              onClick={() => onSelect(method)}
              className={`flex-shrink-0 whitespace-nowrap py-2 px-4 font-semibold transition ${
                selected === method
                  ? "border-b-2 border-white text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTabs;
