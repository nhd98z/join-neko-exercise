import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { UnsupportedChainIdError, Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { isAddress } from 'ethers/lib/utils';
import _ from 'lodash';
import setupNetwork from 'utils/setupNetwork';
import { injected } from 'config/connectors';
import { getLibrary } from 'config/web3';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useBEP20Contract } from 'hooks/contracts';
import { FAST_INTERVAL } from 'config/constants';
import { useBNBBalance } from 'hooks/useBNBBalance';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { ETHER } from '@pancakeswap/sdk';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

function App() {
  const smartContractAddressRef = useRef<HTMLInputElement>(null);
  const recipientAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const balance = useBNBBalance();
  const formattedBalance = balance ? getFullDisplayBalance(balance, ETHER.decimals, ETHER.decimals) : '--';

  const [smartContractAddress, setSmartContractAddress] = useState('');

  const { activate, account, library } = useActiveWeb3React();
  const contract = useBEP20Contract(smartContractAddress);

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
  const [txs, setTxs] = useState<{ hash: string; status: 'pending' | 'success' | 'failed' }[]>([]);
  useEffect(() => {
    const lsTxs = localStorage.getItem('tx-list');
    if (lsTxs) {
      setTxs(JSON.parse(lsTxs));
    }
  }, []);

  const getTxStatuses = useCallback(async () => {
    if (library) {
      const promises = txs.map(async (tx) => {
        if (tx.status !== 'pending') return tx;

        const receipt = await library.getTransactionReceipt(tx.hash);
        return {
          hash: tx.hash,
          status: receipt?.status === 1 ? 'success' : receipt?.status === 0 ? 'failed' : 'pending'
        } as { hash: string; status: 'pending' | 'success' | 'failed' };
      });
      const newTxs = await Promise.all(promises);
      if (!_.isEqual(newTxs, txs)) {
        setTxs(newTxs);
        localStorage.setItem('tx-list', JSON.stringify(newTxs));
      }
    }
  }, [txs, library]);

  useEffect(() => {
    const interval = setInterval(() => {
      getTxStatuses();
    }, FAST_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [getTxStatuses]);

  return (
    <>
      <h1>b1: connect bsc testnet</h1>
      <p>account: {account || '--'}</p>
      <p>balance: {formattedBalance} BNB</p>
      <button
        type="button"
        onClick={() => {
          activate(injected, async (error: Error) => {
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
        type="button"
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
      <input type="number" placeholder="Amount" ref={amountRef} step="0.01" min="0.01" />
      <button
        type="button"
        onClick={async () => {
          if (library && amountRef.current && recipientAddressRef.current) {
            const ra = recipientAddressRef.current.value;
            const amount = new BigNumber(amountRef.current.value);

            if (!isAddress(ra)) {
              alert('Invalid address.');
              return;
            }
            if (balance && amount.isGreaterThan(balance)) {
              alert('Value cannot greater than balance.');
              return;
            }

            const signer = library.getSigner();
            const tx = await signer.sendTransaction({
              from: account ?? undefined,
              to: ra,
              value: ethers.utils.parseEther(amountRef.current.value)
            });
            setTxs((prev: any) => {
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
        type="button"
        onClick={() => {
          setTxs([]);
          localStorage.setItem('tx-list', JSON.stringify([]));
        }}
      >
        clear
      </button>
      {txs.map((tx) => (
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
