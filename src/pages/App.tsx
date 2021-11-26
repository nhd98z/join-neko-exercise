import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useAppDispatch } from 'store';
import { useEffect, useRef, useState } from 'react';
import { useBNBBalance } from 'store/application/hooks';
import { getFullDisplayBalance } from 'utils/bigNumber';
import { useBEP20Contract } from 'hooks/contracts';
import { useTransactionReceipts } from 'store/transactions/hooks';
import { injected } from 'config/web3';
import { UnsupportedChainIdError } from '@web3-react/core';
import setupNetwork from 'config/setupNetwork';
import { isAddress } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { addTransactionReceipt } from 'store/transactions/actions';

export default function App() {
  const { activate, account, library } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  const smartContractAddressRef = useRef<HTMLInputElement>(null);
  const recipientAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const balance = useBNBBalance();
  const formattedBalance = balance ? getFullDisplayBalance(balance) : '--';

  const [smartContractAddress, setSmartContractAddress] = useState('');
  const contract = useBEP20Contract(smartContractAddress);

  const transactionReceipts = useTransactionReceipts();

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
            const recipientAddress = recipientAddressRef.current.value;
            const amount = new BigNumber(amountRef.current.value);

            if (!isAddress(recipientAddress)) {
              alert('Invalid address.');
              return;
            }
            if (balance && amount.isGreaterThan(balance)) {
              alert('Value cannot greater than balance.');
              return;
            }

            const signer = library.getSigner();
            const transactionResponse: ethers.providers.TransactionResponse = await signer.sendTransaction({
              from: account ?? undefined,
              to: recipientAddress,
              value: ethers.utils.parseEther(amountRef.current.value),
            });
            dispatch(addTransactionReceipt({ transactionHash: transactionResponse.hash }));
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
          alert('Clear all transactions');
        }}
      >
        clear
      </button>
      {transactionReceipts.map((transactionReceipt) => (
        <p key={transactionReceipt.transactionHash}>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://testnet.bscscan.com/tx/${transactionReceipt.transactionHash}`}
          >
            {transactionReceipt.transactionHash}
          </a>
          :{' '}
          <span
            style={{
              color: transactionReceipt.status === 0 ? 'red' : transactionReceipt.status === 1 ? 'green' : 'grey',
            }}
          >
            {transactionReceipt.status === 0 ? 'Failed' : transactionReceipt.status === 1 ? 'Success' : 'Pending'}
          </span>
        </p>
      ))}
    </>
  );
}
