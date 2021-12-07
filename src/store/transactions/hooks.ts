import { AppState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { addTransaction, clearAllTransactions, SerializedTransaction, updateTransaction } from 'store/transactions';

export function useArrayTransactions(): SerializedTransaction[] {
  const receipts = useSelector<AppState, AppState['transactions']>((state) => state.transactions);
  return useMemo(() => Object.keys(receipts).map((transactionHash) => receipts[transactionHash]), [receipts]);
}

export function useAddTransactionCallback(): (transactionHash: string) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (transactionHash: string) => {
      dispatch(addTransaction({ transactionHash }));
    },
    [dispatch]
  );
}

export function useUpdateTransactionCallback(): ({
  transactionHash,
  status,
}: {
  transactionHash: string;
  status?: number;
}) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    ({ transactionHash, status }) => {
      dispatch(updateTransaction({ transactionHash, status }));
    },
    [dispatch]
  );
}

export function useClearAllTransactionsCallback(): () => void {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearAllTransactions());
  }, [dispatch]);
}
