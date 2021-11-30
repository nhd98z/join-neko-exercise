import { useCallback, useEffect, useRef } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useTransactionReceipts, useUpdateTransactionReceiptCallback } from 'store/transactions/hooks';
import { useGetBNBBalanceAndSyncToStoreCallback } from 'store/application/hooks';

export default function TransactionsUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const timer = useRef<any>(null);
  const { library } = useActiveWeb3React();
  const transactionReceipts = useTransactionReceipts();
  const getBalance = useGetBNBBalanceAndSyncToStoreCallback();
  const updateTransactionReceipt = useUpdateTransactionReceiptCallback();

  const getTransactionReceipts = useCallback(async () => {
    if (library) {
      transactionReceipts.forEach((transactionReceipt) => {
        if (transactionReceipt.status !== undefined) return;

        library.getTransactionReceipt(transactionReceipt.transactionHash).then((newTransactionReceipt) => {
          if (newTransactionReceipt) {
            updateTransactionReceipt({
              transactionHash: newTransactionReceipt.transactionHash,
              status: newTransactionReceipt.status,
            });
            if (newTransactionReceipt.status) {
              getBalance();
            }
          }
        });
      });
    }
  }, [library, transactionReceipts, getBalance, updateTransactionReceipt]);

  useEffect(() => {
    if (isWindowVisible) {
      getTransactionReceipts();
      timer.current = setInterval(getTransactionReceipts, FAST_INTERVAL);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [isWindowVisible, getTransactionReceipts]);

  return null;
}
