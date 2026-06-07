import BalanceButton from '../BalanceButton';

const Header = () => {
  return (
    <header className="w-full text-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="text-2xl font-bold">Color Trading</div>

        {/* Stats */}
        <div>
          <BalanceButton />
        </div>
      </div>
    </header>
  );
};

export default Header;