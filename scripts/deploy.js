// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

// enter the CHAIN ID you want to deploy to here
const chainID = "localhost";

async function main() {

  if (!chainID) {
    console.error("Chain ID must be set in scripts/deploy.js");
    process.exit(1)
  }
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("NFT_MARKETPLACE_ADDRESS deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("NFT_ADDRESS deployed to:", nft.address);

  const chainConfigFilePath = './src/config-chains.json';
  let chainConfigRaw = fs.readFileSync(chainConfigFilePath);

  let chainConfig = JSON.parse(chainConfigRaw);

  console.log("BEFORE", {chainConfig});

  chainConfig[chainID].NFT_MARKETPLACE_ADDRESS = nftMarket.address;
  chainConfig[chainID].NFT_ADDRESS = nft.address;

  console.log("AFTER", {chainConfig});

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
