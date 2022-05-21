/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const privateKey = process.env.privateKey;
const rpcApiKeyMumbai = process.env.rpcApiKeyMumbai;
const rpcApiKeyAlfajores= process.env.rpcApiKeyAlfajores;

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
    }
  },
}
