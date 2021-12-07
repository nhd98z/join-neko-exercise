import { useEffect, useMemo } from 'react';
import { useArrayTrackingTokens, useUpdateTrackingTokenCallback } from 'store/tokens/hooks';
import useTokens from 'hooks/useTokens';
import _ from 'lodash';
import { serializeToken } from 'store/tokens/helpers';

export default function TokensUpdater() {
  const updateTrackingToken = useUpdateTrackingTokenCallback();

  const trackingTokens = useArrayTrackingTokens();
  const trackingTokenAddresses = useMemo(() => trackingTokens.map(({ address }) => address), [trackingTokens]);
  const tokens = useTokens(trackingTokenAddresses);

  useEffect(() => {
    trackingTokens.forEach(({ address }, index) => {
      const newToken = tokens[index];
      if (newToken === null) return;
      if (_.isEqual(newToken && serializeToken(newToken), trackingTokens[index].token)) return;
      updateTrackingToken(address, newToken);
    });
  }, [tokens, trackingTokens, updateTrackingToken]);

  return null;
}
