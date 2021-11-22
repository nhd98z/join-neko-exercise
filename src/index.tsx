import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  // b1
  const [_account, account] = useState('');
  const [_balance, balance] = useState('');
  // b2
  const [_sca, sca] = useState('');
  // b3
  const [_ra, ra] = useState(''); // Recipient address.
  const [_amount, amount] = useState(''); // BNB amount.
  // b4
  const [_txStatus, txStatus] = useState([]);

  return (
    <>
      <h1>b1: connect bsc testnet</h1>
      <p>account: {_account || '--'}</p>
      <p>balance: {_balance || '--'}BNB</p>
      <button onClick={() => {}}>connect</button>

      <hr />

      <h1>b2: input smart contract address, output its information</h1>
      <input type="text" placeholder="Smart contract address" value={_sca} onChange={(e) => sca(e.target.value)} />
      <button onClick={() => {}}>show smart contract info</button>

      <hr />

      <h1>b3: send BNB to another address</h1>
      <input type="text" placeholder="Recipient address" value={_ra} onChange={(e) => ra(e.target.value)} />
      <input type="number" placeholder="Amount" value={_amount} onChange={(e) => amount(e.target.value)} />
      <button onClick={() => {}}>send</button>

      <hr />

      <h1>b4: follow transaction status</h1>
    </>
  );
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
