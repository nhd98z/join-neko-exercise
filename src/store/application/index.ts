import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

export interface ApplicationState {
  currentBlock: number;
  bnbBalance: BigNumber.Instance | undefined;
  trackingTokenBalances: {
    // Null means "Loading".
    // Undefined means "Not available | Can't fetch".
    [address: string]: BigNumber.Instance | null | undefined;
  };
}

export const initialState: ApplicationState = {
  currentBlock: 0,
  bnbBalance: undefined,
  trackingTokenBalances: {},
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateBNBBalance: (state, action: PayloadAction<{ bnbBalance: BigNumber.Instance }>) => {
      state.bnbBalance = action.payload.bnbBalance;
    },
    updateTokenBalance: (state, action: PayloadAction<{ address: string; balance: BigNumber.Instance }>) => {
      const { address, balance } = action.payload;
      state.trackingTokenBalances[address] = balance;
    },
    updateCurrentBlock: (state, action: PayloadAction<{ newFetchedBlock: number }>) => {
      state.currentBlock = action.payload.newFetchedBlock;
    },
  },
});

export const { updateBNBBalance, updateTokenBalance, updateCurrentBlock } = applicationSlice.actions;

export default applicationSlice.reducer;
