# Art House

Arthouse is an NFT platform that allows you to create, buy and sell NFTs on multiple blockchains.

- https://art.atila.ca

## Quickstart

1. `yarn install`
1. `yarn start`
1. Go to http://localhost:3000/

1. Click on Create NFT
1. Make sure that you can see the created NFT in NFT gallery

To build the project: `yarn build`

Here's a [step-by-step tutorial on how to build your own arthouse](https://atila.ca/blog/tomiwa/how-to-build-a-multi-chain-nft-marketplace-on-ethereum-polygon-and-binance-smart-chain-using-solidity-react-hardhat-and-ethersjs/).

## How it Works

Arthouse can do 4 things:

1. Mint an NFT
1. List an NFT for sale
1. Buy an NFT
1. Unlist an NFT

### NFT Process 

1. Everytime a new NFT is minted it gets deployed to the provided smart contract on the relevant chain ID in `config-chains.json`
1. When it gets listed for sale, approval is given by the account to the Market contract, the NFT is transferred to the address of the contract which will list the item for sale.
1. When the account buys a listed item, the marketplace receives a commission of `salesFeeBasisPoints` (currently 250 basis points or 2.50%) and the seller receives the rest.
1. The seller may choose to unlist an item at which point the ownership of the NFT will be transferred back to the seller and become unavailable for purchase in the market.

## Run Hardhat in Console

To quickly run commands you can use the interactive hardhat console

`npx hardhat console`

```bash
const [ownerSigner, signer1, signer2] = await ethers.getSigners();
const ownerBalance = await ethers.provider.getBalance(ownerSigner.address);
```

### Set up your Backend

1. If you won't be deploying to a test net or mainnet, go to `hardhat.config.js` and comment out `privateKey` and all the networks  except for `networks.hardhat`

1. Put your private keys for the account that will be deploying the smart contract in a `.secrets` file. This will NOT be included in your version control. You can get the key from `shared.secrets` and run `cp shared.secrets .secrets` and replace the private key.

1. Load the secret key `source .secrets`

1. Compile the smart contracts to get the most recent change: `npx hardhat compile`

1. Run your own local blockchain node using: `npx hardhat node`

## Backend
### Running Your Local Node

The backend for this project is a blockchain node. For development, you can run your own local blockchain node using: `npx hardhat node`

## Deploying Smart Contracts

### Deploying Locally

1. Run smart contract deployment script: `npx hardhat run scripts/deploy.js --network localhost`

### Deploying to Testnet or Mainnet

1. Put your private keys for the account that will be deploying the smart contract in `.secrets`. This will NOT be included in your version control and run `source .secrets`.

1. Add the chain information to `src/config-chains.json`
    1. Get Chain ID from:
        1. https://chainlist.org/
    1. Get an RPC URL for your desired blockchain (TODO: where to get good RPC urls)
        1. Binance: https://docs.binance.org/smart-chain/developer/rpc.html (TODO: add other chains)
    1. Add the apikey to `.secrets`

1. Get some tokens to pay the gas fees for deploying the smart contracts. On testnets you can use a faucet:
    1. Ethereum Rinkeby: https://rinkebyfaucet.com
    1. Binance: https://testnet.binance.org/faucet-smart
    1. Polygon: https://faucet.polygon.technology
    1. Celo: https://celo.org/developers/faucet

1. Load secrets to your environment variable `source .secrets`

1. Deploy the smart contract: `npx hardhat deploy --chain-id [chainId]`
    1. If you want to deploy just the NFT or the Market without deploying everything run:
        1.  `npx hardhat deploy:nft --chain-id [chainId]`
        1.  `npx hardhat deploy:market --chain-id [chainId]`
    1. Here are some examples:
    1. Ethereum Rinkeby: `npx hardhat deploy --chain-id 4`
    1. Ethereum Rinkeby NFT only: `npx hardhat deploy:nft --chain-id 4`
    1. Binance Smart Chain Testnet: `npx hardhat deploy --chain-id 97`
    1. Polygon Mumbai: `npx hardhat deploy --chain-id 80001`

If the deploy script is not working you can also us the default hardhat deployment script. Make sure to update the CHAIN ID variable:
TODO add a check that chainID matches the passed in network
 
`npx hardhat run --network polygon scripts/deploy-hardhat.js`

1. Add the new chain information to `README.md`, see these commits below for examples of what to change:
    1. [Ethereum](https://github.com/atilatech/art-house/commit/d97572f9d730a3a469a712dec04fc3ea6dc97eb8)
    1. [Binance](https://github.com/atilatech/art-house/commit/274ff640c116d6637add521e7eae7fe9de2fbe92)
    1. [Polygon](https://github.com/atilatech/art-house/commit/a211ac1bc50d52ffd266b5eb5fd47bf4b232d366)
    1. [Celo](https://github.com/atilatech/art-house/commit/af8ab520fe80c3a148e45a963ead9270e2710a80)

### Verifying Smart Contract on Etherscan (BSCScan, PolygonScan etc.)

1. Get Etherscan API Key: https://etherscan.io/myapikey
    1. Similar process for BSC Scan, PolygonScan etc
1. Set environment variable in `.secrets`: `export ETHERSCAN_API_KEY=""`
1. `npx hardhat verify --network rinkeby [smart_contract_address_you_just deployed]`
    1. Example: `npx hardhat verify --network rinkeby 0x5f3cc650c751fa194f0d1537ecfbb55a2c40a995`
    1. To see a list of other networks: `npx hardhat verify --list-networks`

Note: That the `hardhat.config.js` expects the network name to be camelcase e.g. `bscTestnet: BSCSCAN_API_KEY`,
but when you run the command it should be all lowercase: `npx hardhat verify --network bscTestnet [ADDRESS]`
### Adding a New Chain

1. Add the chain information to `src/config-chains.json`
    1. Get Chain ID from:
        1. https://chainlist.org/
    1. Get an RPC URL for your desired blockchain (TODO: where to get good RPC urls)
        1. Binance: https://docs.binance.org/smart-chain/developer/rpc.html (TODO: add other chains)
    1. Add the apikey to `.secrets`

1. Get some tokens to pay the gas fees for deploying the smart contracts. On testnets you can use a faucet:
    1. Ethereum Rinkeby: https://rinkebyfaucet.com
    1. Binance: https://testnet.binance.org/faucet-smart
    1. Polygon: https://faucet.polygon.technology
    1. Celo: https://celo.org/developers/faucet
    1. Harmony: https://faucet.pops.one

### Smart Contract Addresses

- [View  Ethereum (Rinkeby)  NFT Contract on Block Explorer](https://rinkeby.etherscan.io/token/0x544FEc06fdfB423606d1C705D3105867B8Ff8148)
    - Note: We use Ethereum Rinkeby because that's what Opensea uses, so our testnet NFTs will also be visible on Opensea.
- [View  Binance Smart Chain (Testnet)  NFT Contract on Block Explorer](https://testnet.bscscan.com/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View  Polygon (Mumbai)  NFT Contract on Block Explorer](https://mumbai.polygonscan.com/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)
- [View  Celo (Alfajores)  NFT Contract on Block Explorer](https://alfajores-blockscout.celo-testnet.org/token/0x5216962D1308AA3de2e89c969dacc1B2F798EaB5)

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

## Running Tests

###  Testing Smart Contracts

`npx hardhat test`

Test a specific feature: `npx hardhat test --grep unListMarketItem`

Sometimes you might try to run a test or a piece of code and find that a function is undefined. This might be due to an outdated artifacts build. Run `npx hardhat compile --force` to force a recompilation.

## Deploying smart contracts
1. Compile the smart contracts to get the most recent change: `npx hardhat compile`
1. Load your environment variables using `shared.env` as a template

## Resources

Inspired by Nader Dabit's [Building a Full Stack NFT Marketplace on Ethereum with Polygon](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb).
