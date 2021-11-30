import BigNumber from 'bignumber.js';
import { isAddress } from 'ethers/lib/utils';
import { useBNBBalance } from 'store/application/hooks';
import invariant from 'tiny-invariant';
import { ethers } from 'ethers';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useCallback } from 'react';
import { useAddTransactionReceiptCallback } from 'store/transactions/hooks';
import { getDecimalAmount } from 'utils/bigNumber';

export default function useSendBNBCallback() {
  const balance = useBNBBalance();
  const { library, account } = useActiveWeb3React();
  const addTransactionReceipt = useAddTransactionReceiptCallback();

  return useCallback(
    async (recipientAddress: string, amountBNB: string) => {
      const amountInWei = getDecimalAmount(new BigNumber(amountBNB));
      invariant(library && account, 'Connect wallet first.');
      invariant(isAddress(recipientAddress), `${recipientAddress} is not a valid address.`);
      invariant(balance && amountInWei.isLessThanOrEqualTo(balance), 'Amount cannot greater than balance.');

      const signer = library.getSigner(account);
      const transactionResponse: ethers.providers.TransactionResponse = await signer.sendTransaction({
        from: account ?? undefined,
        to: recipientAddress,
        value: ethers.utils.parseEther(amountBNB),
      });
      addTransactionReceipt(transactionResponse.hash);
    },
    [balance, library, account, addTransactionReceipt]
  );
}
