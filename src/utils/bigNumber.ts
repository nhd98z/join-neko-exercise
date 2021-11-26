import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { BIG_TEN } from 'config/constants';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

export const ethersToBigNumber = (ethersBn: ethers.BigNumber): BigNumber => new BigNumber(ethersBn.toString());

export const ethersToBigNumberInstance = (ethersBn: ethers.BigNumber): BigNumber.Instance => {
  const { s, e, c } = new BigNumber(ethersBn.toString());
  return {
    s,
    e,
    c,
    _isBigNumber: true // Must have.
  };
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals = 18) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
};
