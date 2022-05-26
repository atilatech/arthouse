# Art House

A marketplace for creating, buying and selling NFTs on Ethereum, Polygon and Binance Smart Chain.

- https://art.atila.ca

## Demos

### Video Demos
- https://www.loom.com/share/c4205883b8fd4e499eadf1e349c8ace6
- https://www.loom.com/share/8c690cf68d4a4cbd8b4111d8730cdf75
- https://www.loom.com/share/f2551e83622742bc8963fc4fb25e3f0c

## Smart Contract Addresses

- [View  Ethereum (Rinkeby)  NFT Contract on Block Explorer](https://rinkeby.etherscan.io/token/0x544FEc06fdfB423606d1C705D3105867B8Ff8148)
    - Note: We use Ethereum Rinkeby because that's what Opensea uses, so our testnet NFTs will also be visible on Opensea.
- [View  Binance Smart Chain (Testnet)  NFT Contract on Block Explorer](https://testnet.bscscan.com/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View  Polygon (Mumbai)  NFT Contract on Block Explorer](https://mumbai.polygonscan.com/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View  Celo (Alfajores)  NFT Contract on Block Explorer](https://alfajores-blockscout.celo-testnet.org/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View Harmony (Testnet) NFT Contract on Block Explorer](https://explorer.pops.one/address/0x544FEc06fdfB423606d1C705D3105867B8Ff8148)
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

## Build Frontend

1. `yarn build`
1. 

## Backend
### Running Your Local Node

The backend for this project is a blockchain node. For development, you can run your own local blockchain node using: `npx hardhat node`

## Deploying Smart Contracts

### Deploying Locally

1. Run smart contract deployment script: `npx hardhat run scripts/deploy.js --network localhost`


### Deploying to live Testnet or Mainnet

### Adding a New Chain

1. Put your private keys for the account that will be deploying the smart contract in `.secrets`. This will NOT be included in your version control and run `source .secrets`.

1. Go to `hardhat.config.js` and add the settings for your new chain
    1. Get Chain ID from:
        1. https://chainlist.org/
    1. Get an RPC URL for your desired blockchain (TODO: where to get good RPC urls)
        1. Binance: https://docs.binance.org/smart-chain/developer/rpc.html (TODO: add other chains)
    1. Add the apikey to `.secrets`

1. Add the chain information to `src/config-chains.json`

1. Change the chainID in `scrpts/deploy.js`

1. Get some tokens to pay the gas fees for deploying the smart contracts. On testnets you can use a faucet:
    1. Ethereum Rinkeby: https://rinkebyfaucet.com
    1. Binance: https://testnet.binance.org/faucet-smart
    1. Polygon: https://faucet.polygon.technology
    1. Celo: https://celo.org/developers/faucet
    1. Harmony: https://faucet.pops.one

1. Load secrets to your environment variable `source .secrets`

1. Deploy the smart contract: `npx hardhat run scripts/deploy.js --network [network]`
    1. Celo Alfajores: `npx hardhat run scripts/deploy.js --network alfajores`
    1. Polygon Mumbai: `npx hardhat run scripts/deploy.js --network mumbai`
    1. Ethereum Rinkeby: `npx hardhat run scripts/deploy.js --network rinkeby`
    1. Harmony Testnet: `npx hardhat run scripts/deploy.js --network harmonytestnet`
    1. Binance Smart Chain Testnet: `npx hardhat run scripts/deploy.js --network bsctestnet`
    1. Binance Smart Chain: `npx hardhat run scripts/deploy.js --network binance`

1. Add the new chain information to `README.md`, see these commits below for examples of what to change:
    1. [Ethereum](https://github.com/atilatech/art-house/commit/d97572f9d730a3a469a712dec04fc3ea6dc97eb8)
    1. [Binance](https://github.com/atilatech/art-house/commit/274ff640c116d6637add521e7eae7fe9de2fbe92)
    1. [Polygon](https://github.com/atilatech/art-house/commit/a211ac1bc50d52ffd266b5eb5fd47bf4b232d366)
    1. [Celo](https://github.com/atilatech/art-house/commit/af8ab520fe80c3a148e45a963ead9270e2710a80)

### Deployed Smart Contracts

#### Troubleshooting

If you see, the following doublecheck you set the correct credentials for your RPC URL:
```
Invalid JSON-RPC response received: {
  "message":"Invalid authentication credentials"
}
```
### Adding Chains to Metamask

### Localhost

1. Switch to localhost 8545 in metamask

1. Import private keys from `test-accounts.txt`

1. Use accounts #0-3 for making, selling and buying NFTs between accounts

### Testnets and Main

1. Open Metamask extension and go to settings > networks (TODO add a 1-click button for adding networks)

Public RPCs may have traffic or rate-limits depending on usage.

So you may see the following error.
```
Could not fetch chain ID. Is your RPC URL correct?
```

If that happens, try a different URL or you can [get a free dedicated free RPC URLS](https://docs.polygon.technology/docs/develop/network-details/network/).


[Celo Alfajores](https://docs.celo.org/getting-started/choosing-a-network)

```
Network Name: Celo (Alfajores Testnet)
New RPC URL: https://alfajores-forno.celo-testnet.org
Chain ID: 44787
Currency Symbol (Optional): CELO
Block Explorer URL (Optional): https://alfajores-blockscout.celo-testnet.org
```

[Polygon](https://docs.polygon.technology/docs/develop/network-details/network/):

```
Network Name: Mumbai TestNet
New RPC URL: https://rpc-mumbai.matic.today
Chain ID: 80001
Currency Symbol: Matic
Block Explorer URL: https://mumbai.polygonscan.com/
```

TODO: Get correct Browser settings for Rinkeby (although it's included by default in Metamask)
[Rinkeby Ethereum]
```
Network Name: Mumbai TestNet
New RPC URL: https://rpc-mumbai.matic.today
Chain ID: 80001
Currency Symbol: Matic
Block Explorer URL: https://mumbai.polygonscan.com/
```

[Harmony Testnet](https://docs.tranquil.finance/user-guides/how-to-use-the-testnet-app)

```
Network Name: Harmony Testnet
RPC URL: https://api.s0.b.hmny.io
Chain ID: 1666700000
Currency Symbol: ONE
Block Explorer URL: https://explorer.pops.one/
```

## Running Tests

###  Testing Smart Contracts

`npx hardhat test`
## Deploying smart contracts
1. Compile the smart contracts to get the most recent change: `npx hardhat compile`
1. Load your environment variables using `shared.env` as a template

## Resources

Inspired by Nader Dabit's [Building a Full Stack NFT Marketplace on Ethereum with Polygon](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb).
