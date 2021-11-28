import { createReducer } from '@reduxjs/toolkit';
import {
  SerializedTransactionReceipt,
  addTransactionReceipt,
  updateTransactionReceipt,
  clearAllTransactionReceipts,
} from 'store/transactions/actions';

export interface TransactionState {
  [transactionHash: string]: SerializedTransactionReceipt;
}

export const initialState: TransactionState = {};

export default createReducer<TransactionState>(initialState, (builder) =>
  builder
    .addCase(addTransactionReceipt, (state, { payload: { transactionHash } }) => {
      state[transactionHash] = { transactionHash, status: undefined };
    })
    .addCase(updateTransactionReceipt, (state, { payload: { transactionHash, status } }) => {
      state[transactionHash] = { ...state[transactionHash], status };
    })
    .addCase(clearAllTransactionReceipts, (state) => {
      Object.keys(state).forEach((key) => delete state[key]);
    })
);
