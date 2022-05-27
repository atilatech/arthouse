/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const privateKey = process.env.privateKey;
const rpcApiKeyMumbai = process.env.rpcApiKeyMumbai;

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  paths: {
    artifacts: './src/artifacts',
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${rpcApiKeyMumbai}`,
      accounts: [`0x${privateKey}`],
      chainId: 80001
    },
    alfajores: {
      url: `https://alfajores-forno.celo-testnet.org`,
      accounts: [`0x${privateKey}`],
      chainId: 44787
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${rpcApiKeyMumbai}`,
      accounts: [`0x${privateKey}`],
      chainId: 4
    },
    harmonytestnet: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [`0x${privateKey}`],
      chainId: 1666700000
    },
    bsctestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [`0x${privateKey}`],
      chainId: 97
    },
    binance: {
      url: `https://bsc-dataseed.binance.org`,
      accounts: [`0x${privateKey}`],
      chainId: 56
    },
    polygon: {
      url: `https://polygon-rpc.com`,
      accounts: [`0x${privateKey}`],
      chainId: 137
    }
  },
}
