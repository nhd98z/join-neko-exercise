import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SerializedTransaction {
  transactionHash: string;
  status?: number;
}

export interface TransactionState {
  [transactionHash: string]: SerializedTransaction;
}

export const initialState: TransactionState = {};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<{ transactionHash: string }>) => {
      const { transactionHash } = action.payload;
      state[transactionHash] = { transactionHash, status: undefined };
    },
    updateTransaction: (state, action: PayloadAction<{ transactionHash: string; status: number | undefined }>) => {
      const { transactionHash, status } = action.payload;
      state[transactionHash] = { ...state[transactionHash], status };
    },
    clearAllTransactions: (state) => {
      Object.keys(state).forEach((key) => delete state[key]);
    },
  },
});

export const { addTransaction, updateTransaction, clearAllTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
