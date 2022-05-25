import { Button, Tag } from 'antd';
import React from 'react'
import { CONFIG_CHAINS, LOOKSRARE_SUPPORTED_CHAINS, OPENSEA_SUPPORTED_CHAINS, RARIBLE_SUPPORTED_CHAINS } from '../config';
import { NFTMetadata } from '../models/NFT';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

import "./NFTCard.scss";

function NFTCard({nft}: {nft: NFTMetadata}) {

    const { chainId } = nft;

    const activeChain = CONFIG_CHAINS[chainId];

    const nftBlockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/${activeChain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${activeChain.NFT_ADDRESS}?a=${nft.tokenId}`;

    const openSeaUrl = OPENSEA_SUPPORTED_CHAINS.includes(chainId) ? `https://${activeChain.IS_MAIN_NET? "" : "testnets."}opensea.io/assets/${activeChain.NETWORK_NAME.toLowerCase()}/${activeChain.NFT_ADDRESS}/${nft.tokenId}`: "";
    const raribleUrl = RARIBLE_SUPPORTED_CHAINS.includes(chainId) ? `https://${activeChain.IS_MAIN_NET? "" : "rinkeby."}rarible.com/token/${activeChain.NFT_ADDRESS.toLowerCase()}:${nft.tokenId}`: "";
    const looksrareUrl = LOOKSRARE_SUPPORTED_CHAINS.includes(chainId) ? `https://${activeChain.IS_MAIN_NET? "" : "rinkeby."}looksrare.org/collections/${activeChain.NFT_ADDRESS.toLowerCase()}/${nft.tokenId}`: "";


    async function buyNft(nft: NFTMetadata) {
        /* needs the user to sign the transaction, so will use Web3Provider and sign it */
        const chainConfig = CONFIG_CHAINS[nft.chainId];
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(chainConfig.NFT_MARKETPLACE_ADDRESS, Market.abi, signer);

        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseUnits(nft.price!.toString(), 'ether')   
        const transaction = await contract.createMarketSale(chainConfig.NFT_ADDRESS, nft.itemId, {
        value: price
        })
        await transaction.wait();
    }

    return (
        <div className="NFTCard card shadow">
        <img src={nft.image}  alt={nft.name} width="auto" height="300" className="m-3"/>
        <div className="p-4">
        <h3 className="text-2xl font-semibold">{nft.name}</h3>
        <hr/>

        <div>
            <p className="description">{nft.description}</p>
        </div>
        <hr/>

        <div className="mb-2">
            <Tag color="blue">
                    {activeChain.CHAIN_NAME}
                    <img src={activeChain.LOGO_URL} alt={activeChain.CHAIN_NAME} width={25} />
            </Tag>
        </div>
        <a href={nftBlockExplorerUrl} target="_blank" rel="noreferrer" className="ml-1">
            View NFT on Block Explorer
        </a>
        {/* TODO make this code less repetitve, iterate over a dictionary/list of NFT marketplaces */}
        {openSeaUrl && 
            <>
                <br/>
                <a href={openSeaUrl} target="_blank" rel="noreferrer" className="ml-1">
                    View NFT on OpenSea
                </a>
            </>
        }
        {raribleUrl && 
            <>
                <br/>
                <a href={raribleUrl} target="_blank" rel="noreferrer" className="ml-1">
                    View NFT on Rarible
                </a>
            </>
        }
        {looksrareUrl && 
            <>
                <br/>
                <a href={looksrareUrl} target="_blank" rel="noreferrer" className="ml-1">
                    View NFT on Looks Rare
                </a>
            </>
        }
        </div>
        <hr/>
        <div className="p-4 bg-black">
            <p className="text-2xl mb-4 font-bold">  
            {/* <a href={sellerBlockExplorerUrl} target="_blank" rel="noreferrer" className="ml-1">
                View Seller address
            </a> */}
            </p>
            <p className="text-2xl mb-4 font-bold">{nft.price} ETH</p>
            <Button className="center block" onClick={() => buyNft(nft)}>Buy</Button>
        </div>
        </div>
    )
}

export default NFTCard