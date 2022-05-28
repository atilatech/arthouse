
const fs = require('fs');


const chainConfigFilePath = './src/config-chains.json';
// Helper method for fetching a connection provider to the Ethereum network
function getAvailableChains() {
    let chainConfigRaw = fs.readFileSync(chainConfigFilePath);

    let chainConfigs = JSON.parse(chainConfigRaw);
    return chainConfigs
}

module.exports = {
    getAvailableChains,
    chainConfigFilePath,
}
