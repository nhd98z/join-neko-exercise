import { useEffect, useState } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { FAST_INTERVAL } from 'config/constants';
import BigNumber from 'bignumber.js';
import { ethersToBigNumber } from 'utils/bigNumber';

/**
 * Unit: wei.
 */
export const useBNBBalance = (): BigNumber | undefined => {
  const { account, library } = useActiveWeb3React();
  const [balance, setBalance] = useState<BigNumber | undefined>();

  useEffect(() => {
    const getBalance = async () => {
      if (account && library) {
        const signer = library.getSigner();
        const weiBalance = await signer.getBalance();
        setBalance(ethersToBigNumber(weiBalance));
      }
    };

    getBalance();
    const interval = setInterval(getBalance, FAST_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [account, library]);

  return balance;
};
