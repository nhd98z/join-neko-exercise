import { useEffect, useMemo, useRef } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/memos/useIsWindowVisible';
import { useArrayTrackingTokens, useUpdateTrackingTokenCallback } from 'store/tokens/hooks';
import useTokens from 'hooks/memos/useTokens';
import _ from 'lodash';
import { serializeToken } from 'store/tokens/helpers';

export default function TokensUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const timer = useRef<any>(null);
  const updateTrackingToken = useUpdateTrackingTokenCallback();

  const trackingTokens = useArrayTrackingTokens();
  const trackingTokenAddresses = useMemo(() => trackingTokens.map(({ address }) => address), [trackingTokens]);
  const tokens = useTokens(trackingTokenAddresses);

  useEffect(() => {
    const updateNewTokens = () => {
      trackingTokens.forEach(({ address }, index) => {
        const newToken = tokens[index];
        if (newToken === null) return;
        if (_.isEqual(newToken && serializeToken(newToken), trackingTokens[index].token)) return;
        updateTrackingToken(address, newToken);
      });
    };

    if (isWindowVisible) {
      updateNewTokens();
      timer.current = setInterval(updateNewTokens, FAST_INTERVAL);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [isWindowVisible, trackingTokens, updateTrackingToken, tokens]);

  return null;
}
