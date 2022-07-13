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

## Resources

Inspired by Nader Dabit's [Building a Full Stack NFT Marketplace on Ethereum with Polygon](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb).
