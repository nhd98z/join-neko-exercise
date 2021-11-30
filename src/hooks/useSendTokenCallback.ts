import { useTokenBalances } from 'store/application/hooks';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useAddTransactionCallback } from 'store/transactions/hooks';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { isAddress } from 'ethers/lib/utils';
import { getDecimalAmount } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';

export default function useSendTokenCallback() {
  const tokenBalances = useTokenBalances();
  const { library, account } = useActiveWeb3React();
  const addTransactionReceipt = useAddTransactionCallback();

  return useCallback(
    async (recipientAddress: string, tokenAddress: string, amount: string) => {
      invariant(library && account, 'Connect wallet first.');
      invariant(isAddress(recipientAddress), `${recipientAddress} is not a valid address.`);
      invariant(isAddress(tokenAddress), `${tokenAddress} is not a valid address.`);

      const tokenBalance = tokenBalances[tokenAddress];
      const amountInWei = getDecimalAmount(new BigNumber(amount));
      invariant(tokenBalance && tokenBalance.isLessThanOrEqualTo(amountInWei), 'Amount cannot greater than balance.');

      alert('Sending...');
    },
    [tokenBalances, library, account]
  );
}
