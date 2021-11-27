import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useMemo } from 'react';
import { Contract, ethers } from 'ethers';
import { simpleRpcProvider } from 'config/constants';
import bep20Abi from 'config/abi/erc20.json';
import { isAddress } from 'ethers/lib/utils';

function getContract(abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
}

function getBep20Contract(address: string, signer?: ethers.Signer | ethers.providers.Provider) {
  return getContract(bep20Abi, address, signer);
}

export function useBEP20Contract(address: string): Contract | undefined {
  const { account, library } = useActiveWeb3React();
  return useMemo(
    () =>
      isAddress(address)
        ? getBep20Contract(address, account && library ? library.getSigner(account) : library)
        : undefined,
    [address, account, library]
  );
}
