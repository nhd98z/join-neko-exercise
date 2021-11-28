import { AppState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  addTransactionReceipt,
  clearAllTransactionReceipts,
  SerializedTransactionReceipt,
  updateTransactionReceipt,
} from 'store/transactions/actions';

export function useTransactionReceipts(): SerializedTransactionReceipt[] {
  const receipts = useSelector<AppState, AppState['transactions']>((state) => state.transactions);
  return useMemo(() => Object.keys(receipts).map((transactionHash) => receipts[transactionHash]), [receipts]);
}

export function useAddTransactionReceiptCallback(): (transactionHash: string) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (transactionHash: string) => {
      dispatch(addTransactionReceipt({ transactionHash }));
    },
    [dispatch]
  );
}

export function useUpdateTransactionReceiptCallback(): ({
  transactionHash,
  status,
}: {
  transactionHash: string;
  status?: number;
}) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    ({ transactionHash, status }) => {
      dispatch(updateTransactionReceipt({ transactionHash, status }));
    },
    [dispatch]
  );
}

export function useClearAllTransactionReceiptsCallback(): () => void {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearAllTransactionReceipts());
  }, [dispatch]);
}
