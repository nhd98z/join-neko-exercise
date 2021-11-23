import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { InjectedConnector } from '@web3-react/injected-connector';
import { UnsupportedChainIdError, useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import bep20Abi from 'erc20.json';
import { isAddress } from 'ethers/lib/utils';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { Web3Provider } from '@ethersproject/providers';

export const nodes = [process.env.REACT_APP_NODE];

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(process.env.REACT_APP_NODE);

const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider?.request) {
    const chainId = 97;
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18
            },
            rpcUrls: nodes,
            blockExplorerUrls: ['https://testnet.bscscan.com']
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

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

function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const provider = useWeb3React();

  return useMemo(
    () => (provider.active ? provider : { ...provider, active: true, chainId: 97, library: simpleRpcProvider as any }),
    [provider]
  );
}

function App() {
  const smartContractAddressRef = useRef<HTMLInputElement>(null);
  const recipientAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [balance, setBalance] = useState('');
  const [smartContractAddress, setSmartContractAddress] = useState('');

  const { activate, account, library } = useActiveWeb3React();
  const contract = useERC20(smartContractAddress);

  // set contract in4 when detect changes
  const [contractIn4, setContractIn4] = useState<any>({});
  useEffect(() => {
    (async () => {
      if (contract) {
        const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
        setContractIn4({ name, symbol, decimals });
      }
    })();
  }, [contract]);

  // get tx list from localstorage
  const [txList, setTxList] = useState<{ hash: string; status: 'pending' | 'success' | 'failed' }[]>([]);
  useEffect(() => {
    const oldList = localStorage.getItem('tx-list');
    if (oldList) {
      setTxList(JSON.parse(oldList));
    }
  }, []);

  // get balance
  useEffect(() => {
    const getBalance = async () => {
      if (account && library) {
        const signer = library.getSigner();
        const rawBalance = (await signer.getBalance()).toString();
        const parsedBalance = ethers.utils.formatEther(rawBalance).toString();
        setBalance(parsedBalance);
      }
    };
    void getBalance();
    const interval = setInterval(getBalance, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [account, library]);

  // get tx status list every 7 seconds
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
        localStorage.setItem('tx-list', JSON.stringify(newTxList));
        if (account) {
          const signer = library.getSigner();
          const rawBalance = (await signer.getBalance()).toString();
          const parsedBalance = ethers.utils.formatEther(rawBalance).toString();
          setBalance(parsedBalance);
        }
      }
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [txList, library, account]);

  console.log(`I'm here: `);

  return (
    <>
      <h1>b1: connect bsc testnet</h1>
      <p>account: {account || '--'}</p>
      <p>balance: {balance || '--'} BNB</p>
      <button
        onClick={() => {
          void activate(injected, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
              const hasSetup = await setupNetwork();
              if (hasSetup) {
                await activate(injected);
              }
            }
          });
        }}
        disabled={!!account}
      >
        connect
      </button>

      <hr />

      <h1>b2: input bep20 smart contract address, output its information</h1>
      <input type="text" placeholder="Smart contract address" ref={smartContractAddressRef} />
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
          if (smartContractAddressRef.current) {
            if (isAddress(smartContractAddressRef.current.value)) {
              setSmartContractAddress(smartContractAddressRef.current.value);
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
      <input type="text" placeholder="Recipient address" ref={recipientAddressRef} />
      <input type="number" placeholder="Amount" ref={amountRef} />
      <button
        onClick={async () => {
          if (library && amountRef.current && recipientAddressRef.current) {
            const ra = recipientAddressRef.current.value;
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
          <a target="_blank" rel="noreferrer" href={`https://testnet.bscscan.com/tx/${tx.hash}`}>
            {tx.hash}
          </a>
          :{' '}
          <span style={{ color: tx.status === 'failed' ? 'red' : tx.status === 'success' ? 'green' : 'grey' }}>
            {tx.status}
          </span>
        </p>
      ))}
    </>
  );
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
);
