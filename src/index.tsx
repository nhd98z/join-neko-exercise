import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { InjectedConnector } from '@web3-react/injected-connector';
import { UnsupportedChainIdError, Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { setupNetwork } from 'wallet';
import BigNumber from 'bignumber.js';
import simpleRpcProvider from 'providers';
import bep20Abi from 'erc20.json';
import useActiveWeb3React from 'useActiveWeb3React';
import { isAddress } from 'ethers/lib/utils';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

const injected = new InjectedConnector({ supportedChainIds: [97] });

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer);
};

export const useERC20 = (address: string) => {
  const { library, account } = useActiveWeb3React();
  return useMemo(
    () => (address && library ? getBep20Contract(address, account ? library.getSigner() : undefined) : undefined),
    [account, address, library]
  );
};

function App() {
  // setup
  const { activate, account, library } = useActiveWeb3React();
  // b1
  const [balance, setBalance] = useState('');
  // b2
  const scaRef = useRef<HTMLInputElement>(null);
  const [sca, setSca] = useState('');
  const contract = useERC20(sca);
  const [contractIn4, setContractIn4] = useState<any>({});

  useEffect(() => {
    (async () => {
      if (contract) {
        const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
        setContractIn4({ name, symbol, decimals });
      }
    })();
  }, [contract]);

  // b3
  const raRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  // b4
  const [txList, setTxList] = useState<{ hash: string; status: 'pending' | 'success' | 'failed' }[]>([]);
  useEffect(() => {
    const oldList = localStorage.getItem('tx-list');
    if (oldList) {
      setTxList(JSON.parse(oldList));
    }
  }, []);

  const connect = () => {
    void activate(injected, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork();
        if (hasSetup) {
          await activate(injected);
        }
      }
    });
  };

  useEffect(() => {
    (async () => {
      if (account && library) {
        const signer = library.getSigner();
        const b = await signer.getBalance();
        const bb = new BigNumber(b.toString());
        const bbb = bb.dividedBy(new BigNumber(1e18)).toString();
        setBalance(bbb);
      }
    })();
  }, [account, library]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (library) {
        const promises = txList.map(async (tx) => {
          const receipt = await library.getTransactionReceipt(tx.hash);
          return {
            hash: tx.hash,
            status: receipt?.status === 1 ? 'success' : receipt?.status === 0 ? 'failed' : 'pending'
          } as { hash: string; status: 'pending' | 'success' | 'failed' };
        });
        const newTxList = await Promise.all(promises);
        setTxList(newTxList);
      }
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  }, [txList, library]);

  return (
    <>
      <h1>b1: connect bsc testnet</h1>
      <p>account: {account || '--'}</p>
      <p>balance: {balance || '--'} BNB</p>
      <button
        onClick={() => {
          connect();
        }}
        disabled={!!account}
      >
        connect
      </button>

      <hr />

      <h1>b2: input bep20 smart contract address, output its information</h1>
      <input type="text" placeholder="Smart contract address" ref={scaRef} />
      <p>
        Example:{' '}
        <a href="https://testnet.bscscan.com/token/0x82f1ffcdb31433b63aa311295a69892eebcdc2bb">
          0x82f1ffcdb31433b63aa311295a69892eebcdc2bb
        </a>
      </p>
      <p>name: {contractIn4.name ?? '--'}</p>
      <p>symbol: {contractIn4.symbol ?? '--'}</p>
      <p>decimals: {contractIn4.decimals ?? '--'}</p>
      <button
        onClick={() => {
          if (scaRef.current) {
            if (isAddress(scaRef.current.value)) {
              setSca(scaRef.current.value);
            } else {
              alert('Address not valid.');
            }
          }
        }}
      >
        show smart contract info
      </button>

      <hr />

      <h1>b3: send BNB to another address</h1>
      <p>Example: 0xDa0D8fF1bE1F78c5d349722A5800622EA31CD5dd</p>
      <input type="text" placeholder="Recipient address" ref={raRef} />
      <input type="number" placeholder="Amount" ref={amountRef} />
      <button
        onClick={async () => {
          if (library && amountRef.current && raRef.current) {
            const ra = raRef.current.value;
            const amount = new BigNumber(amountRef.current.value);

            if (!isAddress(ra)) {
              alert('Invalid address.');
              return;
            }
            if (amount.isGreaterThan(balance)) {
              alert('Value cannot greater than balance.');
              return;
            }

            const signer = library.getSigner();
            const tx = await signer.sendTransaction({
              from: account ?? undefined,
              to: ra,
              value: ethers.utils.parseEther(amountRef.current.value)
            });
            setTxList((prev: any) => {
              const newOne = [...prev, { hash: tx.hash, status: 'pending' }];
              localStorage.setItem('tx-list', JSON.stringify(newOne));
              return newOne;
            });
          }
        }}
        disabled={!account}
      >
        send
      </button>

      <hr />

      <h1>b4: follow transaction status</h1>
      <button
        onClick={() => {
          setTxList([]);
          localStorage.setItem('tx-list', JSON.stringify([]));
        }}
      >
        clear
      </button>
      {txList.map((tx) => (
        <p key={tx.hash}>
          {tx.hash}:{' '}
          <span style={{ color: tx.status === 'failed' ? 'red' : tx.status === 'success' ? 'green' : 'grey' }}>
            {tx.status}
          </span>
        </p>
      ))}
    </>
  );
}

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
);
