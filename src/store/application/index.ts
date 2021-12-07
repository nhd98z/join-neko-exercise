import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

export interface ApplicationState {
  bnbBalance: BigNumber.Instance | undefined;
  tokenBalances: {
    // Null means "Loading".
    // Undefined means "Not available | Can't fetch".
    [address: string]: BigNumber.Instance | null | undefined;
  };
}

export const initialState: ApplicationState = {
  bnbBalance: undefined,
  tokenBalances: {},
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
      state.tokenBalances[address] = balance;
    },
  },
});

export const { updateBNBBalance, updateTokenBalance } = applicationSlice.actions;

export default applicationSlice.reducer;
