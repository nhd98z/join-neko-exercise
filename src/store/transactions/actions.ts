import { createAction } from '@reduxjs/toolkit';

export interface SerializedTransaction {
  transactionHash: string;
  status?: number;
}

export const addTransaction = createAction<{ transactionHash: string }>('transactions/addTransaction');
export const updateTransaction = createAction<{ transactionHash: string; status?: number }>(
  'transactions/updateTransaction'
);
export const clearAllTransactions = createAction('transactions/clearAllTransactions');
