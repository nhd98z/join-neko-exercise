import { createReducer } from '@reduxjs/toolkit';
import {
  SerializedTransaction,
  addTransaction,
  updateTransaction,
  clearAllTransactions,
} from 'store/transactions/actions';

export interface TransactionState {
  [transactionHash: string]: SerializedTransaction;
}

export const initialState: TransactionState = {};

export default createReducer<TransactionState>(initialState, (builder) =>
  builder
    .addCase(addTransaction, (state, { payload: { transactionHash } }) => {
      state[transactionHash] = { transactionHash, status: undefined };
    })
    .addCase(updateTransaction, (state, { payload: { transactionHash, status } }) => {
      state[transactionHash] = { ...state[transactionHash], status };
    })
    .addCase(clearAllTransactions, (state) => {
      Object.keys(state).forEach((key) => delete state[key]);
    })
);
