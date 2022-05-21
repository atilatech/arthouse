# Art House

A marketplace for creating, buying and selling NFTs on Ethereum, Polygon and Binance Smart Chain.

Inspired by Nader Dabit's [Building a Full Stack NFT Marketplace on Ethereum with Polygon](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb).

## Quickstart

This project consists of a React frontend and a blockchain backend.

`yarn install`
### Set up your Backend

1. If you won't be deploying to a test net or mainnet, go to `hardhat.config.js` and comment out `privateKey` and all the networks  except for `networks.hardhat`

1. Put your private keys for the account that will be deploying the smart contract in a `.secrets` file. This will NOT be included in your version control. You can get the key from `shared.secrets` and run `cp shared.secrets .secrets` and replace the private key.

1. Load the secret key `source .secrets`

1. Compile the smart contracts to get the most recent change: `npx hardhat compile`

1. Run your own local blockchain node using: `npx hardhat node`

## Frontend

1. `yarn start`
1. Go to http://localhost:3000/
1. Click on Create NFT
1. Make sure that you can see the created NFT in NFT gallery

### Switching Between Chains

To switch between chains. Set `activeChainId` in local storage.

## Backend
### Running Your Local Node

The backend for this project is a blockchain node. For development, you can run your own local blockchain node using: `npx hardhat node`

## Deploying Smart Contracts

### Deploying Locally

1. Run smart contract deployment script: `npx hardhat run scripts/deploy.js --network localhost`


### Deploying to live Testnet or Mainnet

1. Add network settings to Metamask (TODO add a 1-click button for adding networks)

Public RPCs may have traffic or rate-limits depending on usage.

So you may see the following error.
```
Could not fetch chain ID. Is your RPC URL correct?
```

If that happens, try a different URL or you can [get a free dedicated free RPC URLS](https://docs.polygon.technology/docs/develop/network-details/network/).

[Polygon](https://docs.polygon.technology/docs/develop/network-details/network/):

```
Network Name: Mumbai TestNet
New RPC URL: https://rpc-mumbai.matic.today
Chain ID: 80001
Currency Symbol: Matic
Block Explorer URL: 
```

1. Go to `hardhat.config.js` and add the settings for your new chain

    1. Polygon: https://faucet.polygon.technology/

1. Get an RPC URL for your desired blockchain
### Deploying a Smart Contract:

1. Put your private keys for the account that will be deploying the smart contract in a `.secrets.txt`. This will NOT be included in your version control.

1. Run `source .secrets.txt`

### Loading Accounts in Metamask

### Localhost

1. Switch to localhost 8545 in metamask

1. Import private keys from `test-accounts.txt`

1. Use accounts #0-3 for making, selling and buying NFTs between accounts

## Running Tests

###  Testing Smart Contracts

`npx hardhat test`
## Deploying smart contracts
1. Compile the smart contracts to get the most recent change: `npx hardhat compile`
1. Load your environment variables using `shared.env` as a template