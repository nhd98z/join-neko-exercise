import { useTrackingTokenBalances } from 'store/application/hooks';
import { useActiveWeb3React } from 'hooks/memos/useActiveWeb3React';
import { useAddTransactionCallback } from 'store/transactions/hooks';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { isAddress } from 'ethers/lib/utils';
import { bigNumberToEthers, getDecimalAmount } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';
import { useGetBEP20ContractCallback } from 'hooks/memos/useContract';
import { ethers } from 'ethers';
import { Token } from '@pancakeswap/sdk';

export default function useSendTokenCallback() {
  const tokenBalances = useTrackingTokenBalances();
  const { library, account } = useActiveWeb3React();
  const addTransactionReceipt = useAddTransactionCallback();
  const getBEP20Contract = useGetBEP20ContractCallback();

  return useCallback(
    async (token: Token, recipientAddress: string, amount: string) => {
      invariant(library && account, 'Connect wallet first.');
      invariant(isAddress(recipientAddress), `${recipientAddress} is not a valid address.`);

      const tokenBalance = tokenBalances[token.address];
      const tokenBalanceBn = tokenBalance && new BigNumber(tokenBalance);
      const decimalAmount = getDecimalAmount(new BigNumber(amount), token.decimals);
      invariant(tokenBalanceBn, `Unable to fetch ${token} balance.`);
      invariant(tokenBalanceBn.isGreaterThanOrEqualTo(decimalAmount), 'Insufficient balance.');

      const tokenContract = getBEP20Contract(token.address);
      if (tokenContract) {
        tokenContract
          .transfer(recipientAddress, bigNumberToEthers(decimalAmount))
          .then((receipt: ethers.providers.TransactionResponse) => {
            addTransactionReceipt(receipt.hash);
          });
      }
    },
    [tokenBalances, library, account, getBEP20Contract, addTransactionReceipt]
  );
}
