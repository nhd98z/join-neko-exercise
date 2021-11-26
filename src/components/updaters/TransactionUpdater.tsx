import { useCallback, useEffect, useRef } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useTransactionReceipts } from 'store/transactions/hooks';
import { updateTransactionReceipt } from 'store/transactions/actions';
import { useAppDispatch } from 'store';
import { useGetBalanceCallback } from 'store/application/hooks';

export default function TransactionUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const timer = useRef<any>(null);
  const { library } = useActiveWeb3React();
  const transactionReceipts = useTransactionReceipts();
  const dispatch = useAppDispatch();
  const getBalance = useGetBalanceCallback();

  const getTransactionReceipts = useCallback(async () => {
    if (library) {
      transactionReceipts.forEach((transactionReceipt) => {
        if (transactionReceipt.status !== undefined) return;

        library.getTransactionReceipt(transactionReceipt.transactionHash).then((newTransactionReceipt) => {
          if (newTransactionReceipt) {
            dispatch(
              updateTransactionReceipt({
                transactionHash: newTransactionReceipt.transactionHash,
                status: newTransactionReceipt.status,
              })
            );
            if (newTransactionReceipt.status) {
              getBalance();
            }
          }
        });
      });
    }
  }, [dispatch, library, transactionReceipts, getBalance]);

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
