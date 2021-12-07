import { AppState, useAppDispatch } from 'store';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { isAddress } from 'ethers/lib/utils';
import { addTrackingToken, removeTrackingToken, SerializedToken, updateTrackingToken } from 'store/tokens';
import { Token } from '@pancakeswap/sdk';
import { useSelector } from 'react-redux';
import { serializeToken } from 'store/tokens/helpers';

export function useTrackingTokens(): { [address: string]: SerializedToken | null | undefined } {
  return useSelector<AppState, AppState['tokens']>((state) => state.tokens);
}

export function useArrayTrackingTokens(): { address: string; token: SerializedToken | null | undefined }[] {
  const trackingTokens = useSelector<AppState, AppState['tokens']>((state) => state.tokens);

  return useMemo(
    () =>
      Object.keys(trackingTokens).reduce(
        (acc: { address: string; token: SerializedToken | null | undefined }[], address) => [
          ...acc,
          { address, token: trackingTokens[address] },
        ],
        []
      ),
    [trackingTokens]
  );
}

export function useAddTrackingTokenCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (address: string) => {
      invariant(isAddress(address), `${address} is not a valid address.`);
      dispatch(addTrackingToken({ address }));
    },
    [dispatch]
  );
}

export function useUpdateTrackingTokenCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (address: string, token: Token | null | undefined) => {
      dispatch(updateTrackingToken({ address, token: token && serializeToken(token) }));
    },
    [dispatch]
  );
}

export function useRemoveTrackingTokenCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (address: string) => {
      dispatch(removeTrackingToken({ address }));
    },
    [dispatch]
  );
}
