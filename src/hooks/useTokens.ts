import { useEffect, useState } from 'react';
import { useBEP20Contracts } from 'hooks/useContract';
import { Token } from '@pancakeswap/sdk';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { CHAIN_ID } from 'config/constants';
import { Contract } from 'ethers';

export default function useTokens(addresses: string[]): (Token | null | undefined)[] {
  const contracts = useBEP20Contracts(addresses);
  const { chainId = CHAIN_ID } = useActiveWeb3React();

  const [tokens, setTokens] = useState<(Token | null | undefined)[]>(
    Array.from({ length: addresses.length }, () => null)
  );

  useEffect(() => {
    setTokens(Array.from({ length: addresses.length }, () => null));

    const fetchToken = async (address: string, contract: Contract | undefined) => {
      try {
        if (contract) {
          const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
          return new Token(chainId, address, decimals, symbol, name);
        }
        return undefined;
      } catch {
        return undefined;
      }
    };

    const promises = addresses.map((address, index) => fetchToken(address, contracts[index]));

    Promise.all(promises).then((newTokens) => {
      setTokens(newTokens);
    });
  }, [chainId, addresses, contracts]);

  return tokens;
}
