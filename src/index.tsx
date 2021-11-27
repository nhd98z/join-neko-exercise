import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from 'config/web3';
import { Provider } from 'react-redux';
import store from 'store';
import ApplicationUpdater from 'components/updaters/ApplicationUpdater';
import TransactionUpdater from 'components/updaters/TransactionUpdater';
import App from 'pages/App';
import BigNumber from 'bignumber.js';
import 'index.scss';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
    </>
  );
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <Updaters />
        <App />
      </Provider>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
);
