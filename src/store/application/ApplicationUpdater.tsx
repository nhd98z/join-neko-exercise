import { useEffect } from 'react';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import {
  useGetBNBBalanceAndSyncToStoreCallback,
  useGetTrackingTokenBalancesAndSyncToStoreCallback,
} from 'store/application/hooks';
import { useCurrentBlock } from 'store/block/hooks';

export default function ApplicationUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const getBNBBalance = useGetBNBBalanceAndSyncToStoreCallback();
  const getTokenBalances = useGetTrackingTokenBalancesAndSyncToStoreCallback();
  const currentBlock = useCurrentBlock();

  useEffect(() => {
    const fetchData = () => {
      getBNBBalance();
      getTokenBalances();
    };

    if (isWindowVisible) {
      fetchData();
    }
  }, [isWindowVisible, getBNBBalance, getTokenBalances, currentBlock]);

  return null;
}
