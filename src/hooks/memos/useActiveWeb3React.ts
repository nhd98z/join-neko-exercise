// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { CHAIN_ID } from 'config/constants';
import useSimpleRpcProvider from 'hooks/memos/useSimpleRpcProvider';

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const provider = useWeb3React();
  const simpleRpcProvider = useSimpleRpcProvider();

  return useMemo(
    () => (provider.active ? provider : { ...provider, active: true, chainId: CHAIN_ID, library: simpleRpcProvider }),
    [provider, simpleRpcProvider]
  );
}
