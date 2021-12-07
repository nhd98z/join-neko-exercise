import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
  projectLink?: string;
}

export interface TokenState {
  // Null means "Loading".
  // Undefined means "Not available | Can't fetch".
  [address: string]: SerializedToken | null | undefined;
}

export const initialState: TokenState = {};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addTrackingToken: (state, action: PayloadAction<{ address: string }>) => {
      state[action.payload.address] = undefined;
    },
    updateTrackingToken: (
      state,
      action: PayloadAction<{ address: string; token: SerializedToken | null | undefined }>
    ) => {
      const { address, token } = action.payload;
      state[address] = token;
    },
    removeTrackingToken: (state, action: PayloadAction<{ address: string }>) => {
      delete state[action.payload.address];
    },
  },
});

export const { addTrackingToken, updateTrackingToken, removeTrackingToken } = tokensSlice.actions;

export default tokensSlice.reducer;
