import { useEffect } from 'react';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useArrayTransactions, useUpdateTransactionCallback } from 'store/transactions/hooks';
import { useGetBNBBalanceAndSyncToStoreCallback } from 'store/application/hooks';
import { useCurrentBlock } from 'store/block/hooks';

export default function TransactionsUpdater() {
  const { library } = useActiveWeb3React();
  const transactions = useArrayTransactions();
  const getBalance = useGetBNBBalanceAndSyncToStoreCallback();
  const updateTransaction = useUpdateTransactionCallback();

  const currentBlock = useCurrentBlock();

  useEffect(() => {
    const getTransactions = async () => {
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
    };

    getTransactions();
  }, [currentBlock, getBalance, library, transactions, updateTransaction]);

  return null;
}
