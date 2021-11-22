import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import simpleRpcProvider from 'providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useMemo } from 'react';

export default function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const provider = useWeb3React();

  return useMemo(
    () => (provider.active ? provider : { ...provider, active: true, chainId: 97, library: simpleRpcProvider as any }),
    [provider]
  );
}
