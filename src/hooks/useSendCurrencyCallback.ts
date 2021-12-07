import { useCallback } from 'react';
import { Currency, Token } from '@pancakeswap/sdk';
import { isToken } from 'utils/web3';
import { useBNBBalance, useTrackingTokenBalances } from 'store/application/hooks';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useAddTransactionCallback } from 'store/transactions/hooks';
import { bigNumberToEthers, getDecimalAmount } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';
import invariant from 'tiny-invariant';
import { isAddress } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import { useGetBEP20ContractCallback } from 'hooks/useContract';

function useSendBNBCallback() {
  const balance = useBNBBalance();
  const { library, account } = useActiveWeb3React();
  const addTransactionReceipt = useAddTransactionCallback();

  return useCallback(
    async (recipientAddress: string, amountBNB: string) => {
      const amountInWei = getDecimalAmount(new BigNumber(amountBNB));
      invariant(library && account, 'Connect wallet first.');
      invariant(isAddress(recipientAddress), `${recipientAddress} is not a valid address.`);
      invariant(balance && amountInWei.isLessThanOrEqualTo(balance), 'Amount cannot greater than balance.');

      const signer = library.getSigner(account);
      const transactionResponse: ethers.providers.TransactionResponse = await signer.sendTransaction({
        from: account,
        to: recipientAddress,
        value: ethers.utils.parseEther(amountBNB),
      });
      addTransactionReceipt(transactionResponse.hash);
    },
    [balance, library, account, addTransactionReceipt]
  );
}

function useSendTokenCallback() {
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
