export const nodes = [process.env.REACT_APP_NODE];

const getNodeUrl = () => {
  // Use custom node if available (both for development and production)
  // However on the testnet it wouldn't work, so if on testnet - comment out the REACT_APP_NODE_PRODUCTION from env file
  if (process.env.REACT_APP_NODE_PRODUCTION) {
    return process.env.REACT_APP_NODE_PRODUCTION;
  }
  return nodes[0];
};

export default getNodeUrl;
