const Web3 = require('web3');
const {
  Web3ProviderConnector,
  MultiCallService,
  GasLimitService
} = require('@1inch/multicall');
const {ERC20ABI, walletAddress, contractAddress} = require('./util')
const tokens = require('./tokenlist')

const provider = new Web3ProviderConnector(
  new Web3(
    'https://eth-mainnet.g.alchemy.com/v2/G634ktS8wAiim3GE02dRjGWwAjBDjNkT'
  )
);

const gasLimitService = new GasLimitService(provider, contractAddress);
const multiCallService = new MultiCallService(provider, contractAddress);

const balanceOfGasUsage = 30_000;

const requests = tokens.map((tokenAddress) => {
    return {
        to: tokenAddress,
        data: provider.contractEncodeABI(
            ERC20ABI,
            tokenAddress,
            'balanceOf',
            [walletAddress]
        ),
        gas: balanceOfGasUsage
    };
});

const gasLimit = gasLimitService.calculateGasLimit();

const params = {
    maxChunkSize: 500,
    retriesLimit: 3,
    blockNumber: 'latest',
    gasBuffer: 3000000,
    maxGasLimit: 150000000
};


console.time('response time')
const response = multiCallService.callByGasLimit(
    requests,
    gasLimit,
    params
).then((res)=>{
  console.log(res)
  console.timeEnd('response time')
});
