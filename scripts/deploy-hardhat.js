// If the deploy task is not working use the old school deploy script
// npx hardhat run --network polygon scripts/deploy.js
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

// enter the CHAIN ID you want to deploy to here
// TODO make this a task so it can be passed as a command line argument
//  - https://stackoverflow.com/questions/69111785/hardhat-run-with-parameters
// - https://hardhat.org/guides/create-task.html
const chainID = "1666700000";

async function main() {

  if (!chainID) {
    console.error("Chain ID must be set in scripts/deploy.js");
    process.exit(1)
  }

  const chainConfigFilePath = './src/config-chains.json';
  let chainConfigRaw = fs.readFileSync(chainConfigFilePath);

  let chainConfig = JSON.parse(chainConfigRaw);

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  chainConfig[chainID].NFT_MARKETPLACE_ADDRESS = nftMarket.address;

  console.log("NFT_MARKETPLACE_ADDRESS deployed to:", nftMarket.address);
  console.log("\x1b[32m%s\x1b[0m", `View in block explorer: ${chainConfig[chainID].BLOCK_EXPLORER_URL}/address/${chainConfig[chainID].NFT_MARKETPLACE_ADDRESS}`);
  fs.writeFileSync(chainConfigFilePath, JSON.stringify(chainConfig, null, 4))

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  chainConfig[chainID].NFT_ADDRESS = nft.address;

  console.log("NFT_ADDRESS deployed to:", nft.address);
  console.log("\x1b[32m%s\x1b[0m", `View in block explorer: ${chainConfig[chainID].BLOCK_EXPLORER_URL}/address/${chainConfig[chainID].NFT_ADDRESS}`);

  fs.writeFileSync(chainConfigFilePath, JSON.stringify(chainConfig, null, 4))
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });