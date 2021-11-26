import { createReducer } from '@reduxjs/toolkit';
import {
  addTransactionReceipt,
  SerializedTransactionReceipt,
  updateTransactionReceipt,
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
    }),
);
