import { createReducer } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { updateBNBBalance, updateTokenBalance } from 'store/application/actions';

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

export default createReducer<ApplicationState>(initialState, (builder) => {
  builder
    .addCase(updateBNBBalance, (state, { payload: { bnbBalance } }) => {
      state.bnbBalance = bnbBalance;
    })
    .addCase(updateTokenBalance, (state, { payload: { address, balance } }) => {
      state.tokenBalances[address] = balance;
    });
});
