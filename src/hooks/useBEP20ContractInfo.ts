import { useEffect, useState } from 'react';
import { useBEP20Contract } from 'hooks/contracts';

export interface BEP20Response {
  name: string;
  symbol: string;
  decimals: number;
}

export default function useBep20ContractInfo(address: string): BEP20Response | undefined {
  const bep20Contract = useBEP20Contract(address);
  const [response, setResponse] = useState<BEP20Response>();

  useEffect(() => {
    const fetchData = async () => {
      if (bep20Contract) {
        const [name, symbol, decimals] = await Promise.all([
          bep20Contract.name(),
          bep20Contract.symbol(),
          bep20Contract.decimals(),
        ]);
        setResponse({ name, symbol, decimals });
      }
    };

    fetchData();
  }, [bep20Contract]);

  return response;
}
