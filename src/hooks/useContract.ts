import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useMemo } from 'react';
import { Contract, ethers } from 'ethers';
import { simpleRpcProvider } from 'config/constants';
import bep20Abi from 'config/abi/bep20.json';
import { isAddress } from 'ethers/lib/utils';

function getContract(abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
}

function getBep20Contract(address: string, signer?: ethers.Signer | ethers.providers.Provider) {
  return getContract(bep20Abi, address, signer);
}

export function useBEP20Contracts(addresses: string[]): (Contract | undefined)[] {
  const { account, library } = useActiveWeb3React();
  return useMemo(
    () =>
      addresses.map((address) =>
        isAddress(address)
          ? getBep20Contract(address, account && library ? library.getSigner(account) : library)
          : undefined
      ),
    [addresses, account, library]
  );
}
