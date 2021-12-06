import { useTokenBalances } from 'store/application/hooks';
import { useActiveWeb3React } from 'hooks/memos/useActiveWeb3React';
import { useAddTransactionCallback } from 'store/transactions/hooks';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { isAddress } from 'ethers/lib/utils';
import { bigNumberToEthers, getDecimalAmount } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';
import { useBEP20Contracts } from 'hooks/memos/useContract';
import { ethers } from 'ethers';
import { Token } from '@pancakeswap/sdk';

export default function useSendTokenCallback(token?: Token) {
  const tokenBalances = useTokenBalances();
  const { library, account } = useActiveWeb3React();
  const addTransactionReceipt = useAddTransactionCallback();
  const tokenContract = useBEP20Contracts([token?.address ?? ''])[0];

  return useCallback(
    async (recipientAddress: string, amount: string) => {
      invariant(library && account, 'Connect wallet first.');
      invariant(isAddress(recipientAddress), `${recipientAddress} is not a valid address.`);
      invariant(token, `${token} is not a valid token.`);

      const tokenBalance = tokenBalances[token.address];
      const tokenBalanceBn = tokenBalance && new BigNumber(tokenBalance);
      const amountInWei = getDecimalAmount(new BigNumber(amount), token.decimals);
      invariant(tokenBalanceBn, `Unable to fetch ${token} balance.`);
      invariant(tokenBalanceBn.isGreaterThanOrEqualTo(amountInWei), 'Insufficient balance.');

      if (tokenContract) {
        tokenContract
          .transfer(recipientAddress, bigNumberToEthers(amountInWei))
          .then((receipt: ethers.providers.TransactionResponse) => {
            addTransactionReceipt(receipt.hash);
          });
      }
    },
    [tokenBalances, library, account, tokenContract, token, addTransactionReceipt]
  );
}
