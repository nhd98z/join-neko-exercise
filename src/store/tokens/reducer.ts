import { createReducer } from '@reduxjs/toolkit';
import { addTrackingToken, removeTrackingToken, SerializedToken, updateTokenInformation } from 'store/tokens/actions';

export interface TokenState {
  // Null means "Loading".
  // Undefined means "Not available | Can't fetch".
  [address: string]: SerializedToken | null | undefined;
}

export const initialState: TokenState = {};

export default createReducer<TokenState>(initialState, (builder) => {
  builder
    .addCase(addTrackingToken, (state, { payload: { address } }) => {
      state[address] = undefined;
    })
    .addCase(updateTokenInformation, (state, { payload: { address, token } }) => {
      state[address] = token;
    })
    .addCase(removeTrackingToken, (state, { payload: { address } }) => {
      delete state[address];
    });
});
