const Web3 = require('web3');
const dotenv = require('dotenv');
const { Web3ProviderConnector } = require('@1inch/multicall');
const { ERC20ABI/*, tokens*/, walletAddress } = require('./util'); // тут в tokens их мало
const tokens = require('./tokenlist') //тут много токенов

dotenv.config({path: './config.env'});

const provider = new Web3ProviderConnector(new Web3('HTTP://0.0.0.0:7545'/*process.env.ALCHEMY_KEY*/));

const contractCalls = tokens.map(async (tokenAddress) => {
  const callData = provider.contractEncodeABI(
    ERC20ABI,
    tokenAddress,
    'balanceOf',
    [walletAddress]
  );
  return provider.ethCall(tokenAddress, callData);
});

console.time('balance');
Promise.all(contractCalls).then((res) => {
  console.log(res);
  console.timeEnd('balance');
});
