const Web3 = require('web3');
const dotenv = require('dotenv');
const { Web3ProviderConnector, MultiCallService } = require('@1inch/multicall');
const { ERC20ABI, walletAddress, contractAddress } = require('./util');
const tokens = require('./tokenlist')

dotenv.config({ path: './config.env' });

const provider = new Web3ProviderConnector(new Web3(process.env.ALCHEMY_KEY));
const multiCallService = new MultiCallService(provider, contractAddress);

// The parameters are optional, if not specified, the default will be used
const params = {
  chunkSize: 100,
  retriesLimit: 3,
  blockNumber: 'latest',
};

const callDatas = tokens.map((tokenAddress) => {
  return {
    to: tokenAddress,
    data: provider.contractEncodeABI(ERC20ABI, tokenAddress, 'balanceOf', [
      walletAddress,
    ]),
  };
});

console.time('balance');
multiCallService.callByChunks(callDatas, params).then(() => {
  console.timeEnd('balance');
});
