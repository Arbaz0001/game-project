import BalanceButton from '../BalanceButton';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="text-2xl font-bold">CHICKEN <span className='text-yellow-500'>ROAD</span></div>

        {/* Stats */}
        <div>
          <BalanceButton />
        </div>
      </div>
    </header>
  );
};

export default Header;