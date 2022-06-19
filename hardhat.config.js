/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("./scripts/deploy.js");

const { hardHatSettings } = require("./scripts/helpers.js");
const { ETHERSCAN_API_KEY, BSCSCAN_API_KEY } = process.env;

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
  networks: hardHatSettings.networks,
  etherscan: {
    apiKey: {
        mainnet: ETHERSCAN_API_KEY,
        rinkeby: ETHERSCAN_API_KEY,
        bsc: BSCSCAN_API_KEY,
        bscTestnet: BSCSCAN_API_KEY,
    }
  }
}
