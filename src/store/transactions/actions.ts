import { createAction } from '@reduxjs/toolkit';

export interface SerializedTransactionReceipt {
  transactionHash: string;
  status?: number;
}

export const addTransactionReceipt = createAction<{ transactionHash: string }>('transactions/addTransactionReceipt');
export const updateTransactionReceipt = createAction<{ transactionHash: string; status?: number }>(
  'transactions/updateTransactionReceipt'
);
