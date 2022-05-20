# Art House

A marketplace for creating, buying and selling NFTs on Ethereum, Polygon and Binance Smart Chain.

Inspired by Nader Dabit's [Building a Full Stack NFT Marketplace on Ethereum with Polygon](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb).

## Quickstart

This project consists of a React frontend and a blockchain backend.
### Frontend

`yarn install`

`yarn start`

### Backend
### Running Your Local Node

The backend for this project is a blockchain node. For development, you can run your own local blockchain node using: `npx hardhat node`

### Deploying a Smart Contract:

1. Put your private keys for the account that will be deploying the smart contract in a `.secrets.txt`. This will NOT be included in your version control.

1. Run `source .secrets.txt`

1. Compile the smart contracts to get the most recent change: `npx hardhat compile`

1. Run smart contract deployment script: `npx hardhat run scripts/deploy.js --network localhost`

### Loading Test Accounts in Metamask

1. Switch to localhost 8545 in metamask

1. Import private keys from `test-accounts.txt`

1. Use accounts #0-3 for making, selling and buying NFTs between accounts

## Using the App

1. Go to http://localhost:3000/
2. Click on Create NFT
3. Make sure that you can see the created NFT in NFT gallery

## Running Tests

###  Testing Smart Contracts

`npx hardhat test`
## Deploying smart contracts
1. Compile the smart contracts to get the most recent change: `npx hardhat compile`
1. Load your environment variables using `shared.env` as a template