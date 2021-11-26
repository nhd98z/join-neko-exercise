import { useEffect, useRef } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import { useGetBalanceCallback } from 'store/application/hooks';

export default function ApplicationUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const timer = useRef<any>(null);
  const getBalance = useGetBalanceCallback();

  useEffect(() => {
    if (isWindowVisible) {
      getBalance();
      timer.current = setInterval(getBalance, FAST_INTERVAL);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [isWindowVisible, getBalance]);

  return null;
}
