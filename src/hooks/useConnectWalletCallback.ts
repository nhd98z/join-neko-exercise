import { injected } from 'config/web3';
import { UnsupportedChainIdError } from '@web3-react/core';
import setupNetwork from 'config/setupNetwork';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useCallback } from 'react';

export default function useConnectWalletCallback() {
  const { activate } = useActiveWeb3React();

  return useCallback(() => {
    activate(injected, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork();
        if (hasSetup) {
          await activate(injected);
        }
      }
    });
  }, [activate]);
}
