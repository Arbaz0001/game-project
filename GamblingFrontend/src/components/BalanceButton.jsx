import { useBalance } from "../context/BalanceContext";

const BalanceButton = () => {
  const { balance } = useBalance();
  console.log(balance);
  const integerBalance = Math.floor(parseInt(balance, 10));

  return (
    <div className="w-24 px-3 min-w-32 py-2 bg-transparent shadow-xs shadow-[#9C1137] rounded text-gray-200 font-medium relative text-center">
      <img src="./coin1.png" className="h-6 absolute top-2" />₹{" "}
      {`${integerBalance}`}
    </div>
  );
};

export default BalanceButton;
