import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { BIG_TEN } from 'config/constants';

export function bigNumberToEthers(bn: BigNumber): ethers.BigNumber {
  return ethers.BigNumber.from(bn.toString());
}

export function ethersToBigNumber(ethersBn: ethers.BigNumber): BigNumber {
  return new BigNumber(ethersBn.toString());
}

export function ethersToBigNumberInstance(ethersBn: ethers.BigNumber): BigNumber.Instance {
  const { s, e, c } = new BigNumber(ethersBn.toString());
  return {
    s,
    e,
    c,
    _isBigNumber: true, // Must have.
  };
}

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export function getBalanceAmount(amount: BigNumber, decimals = 18): BigNumber {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
}

export function getFullDisplayBalance(balance: BigNumber, decimals = 18, displayDecimals = 18): string {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
}
