import { createAction } from '@reduxjs/toolkit';

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
  projectLink?: string;
}

export const addTrackingToken = createAction<{ address: string }>('tokens/addTrackingToken');
export const updateTokenInformation = createAction<{ address: string; token: SerializedToken | null | undefined }>(
  'tokens/updateTokenInformation'
);
export const removeTrackingToken = createAction<{ address: string }>('tokens/removeTrackingToken');
