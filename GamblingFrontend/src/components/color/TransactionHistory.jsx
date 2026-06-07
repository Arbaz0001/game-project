import React from 'react';
import moment from 'moment';

const TransactionHistory = ({ userBets }) => {
  const formatTransactionType = (bet) => {
    if (bet.hasOwnProperty('isWon')) {
      return bet.isWon ? 'Period Win' : 'Join Period';
    }
    return 'Join Period';
  };

  const getAmount = (bet) => {
    if (bet.isWon) {
      return `+${bet.payout}`;
    } else {
      return `-${bet.amount}`;
    }
  };

  const getAmountStyle = (bet) => {
    return {
      color: bet.isWon ? 'green' : 'red',
      fontWeight: 'bold'
    };
  };

  return (
    <div>
      <ul>
        {userBets.map((bet, index) => (
          <li key={bet._id || index} className='flex justify-around items-center py-2'>
            <div>{moment(bet.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            <div style={getAmountStyle(bet)}>{getAmount(bet)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;