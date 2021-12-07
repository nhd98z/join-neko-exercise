import { useCallback, useEffect, useRef } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/memos/useIsWindowVisible';
import { useActiveWeb3React } from 'hooks/memos/useActiveWeb3React';
import { useArrayTransactions, useUpdateTransactionCallback } from 'store/transactions/hooks';
import { useGetBNBBalanceAndSyncToStoreCallback } from 'store/application/hooks';

export default function TransactionsUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const timer = useRef<any>(null);
  const { library } = useActiveWeb3React();
  const transactions = useArrayTransactions();
  const getBalance = useGetBNBBalanceAndSyncToStoreCallback();
  const updateTransaction = useUpdateTransactionCallback();

  const getTransactions = useCallback(async () => {
    if (library) {
      transactions.forEach((transaction) => {
        if (transaction.status !== undefined) return;

        library.getTransactionReceipt(transaction.transactionHash).then((newTransaction) => {
          if (newTransaction) {
            updateTransaction({
              transactionHash: newTransaction.transactionHash,
              status: newTransaction.status,
            });
            if (newTransaction.status) {
              getBalance();
            }
          }
        });
      });
    }
  }, [library, transactions, getBalance, updateTransaction]);

  useEffect(() => {
    if (isWindowVisible) {
      getTransactions();
      timer.current = setInterval(getTransactions, FAST_INTERVAL);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [isWindowVisible, getTransactions]);

  return null;
}
