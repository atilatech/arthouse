const { hardHatSettings } = require("./scripts/helpers.js");

/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("./scripts/deploy.js");

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
}
