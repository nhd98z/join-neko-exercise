import { AppState } from 'store';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { SerializedTransactionReceipt } from 'store/transactions/actions';

export function useTransactionReceipts(): SerializedTransactionReceipt[] {
  const receipts = useSelector<AppState, AppState['transactions']>((state) => state.transactions);
  return useMemo(() => Object.keys(receipts).map((transactionHash) => receipts[transactionHash]), [receipts]);
}
