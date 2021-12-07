import useSendBNBCallback from 'hooks/callbacks/useSendBNBCallback';
import useSendTokenCallback from 'hooks/callbacks/useSendTokenCallback';
import { useCallback } from 'react';
import { Currency } from '@pancakeswap/sdk';
import { isToken } from 'utils/web3';

export default function useSendCurrencyCallback() {
  const sendBNB = useSendBNBCallback();
  const sendToken = useSendTokenCallback();

  return useCallback(
    (currency: Currency, recipientAddress: string, amount: string) => {
      if (isToken(currency)) {
        sendToken(currency, recipientAddress, amount);
      } else {
        sendBNB(recipientAddress, amount);
      }
    },
    [sendBNB, sendToken]
  );
}
