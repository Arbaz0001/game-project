import React from 'react';
import moment from 'moment';

const TransactionHistory = ({ userBets }) => {
  const formatTransactionType = (bet) => {
    return (bet.payoutAmount > 0) ? 'Period Win' : 'Join Period';
  };

  const getAmount = (bet) => {
    return (bet.payoutAmount > 0) ? `+${bet.payoutAmount}` : `${bet.betAmount}`
  };

  const getAmountStyle = (bet) => {
    return {
      color: bet.payoutAmount > 0 ? 'green' : 'red',
      fontWeight: 'bold'
    };
  };

  return (
    <div>
      <ul>
        {userBets.map((bet, index) => (
          <div key={index} className="grid grid-cols-2 text-center py-2 rounded">
            <div className="text-sm font-medium">
              {moment(bet?.createdAt).local().format('YYYY-MM-DD hh:mm A')}
            </div>
            <div style={getAmountStyle(bet)}>{getAmount(bet)}</div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;