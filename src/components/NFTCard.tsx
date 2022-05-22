import { Button, Tag } from 'antd';
import React from 'react'
import { CONFIG_CHAINS } from '../config';
import { NFTMetadata } from '../models/NFT';

function NFTCard({nft, chainId}: {nft: NFTMetadata, chainId: string}) {

const activeChain = CONFIG_CHAINS[chainId];

const nftBlockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/token/${activeChain.NFT_ADDRESS}?a=${nft.tokenId}`;
const sellerBlockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/address/${nft.seller}`;

  return (
    <div className="card shadow">
    <img src={nft.image}  alt={nft.name} width="auto" height="300" className="m-3"/>
    <div className="p-4">
    <h3 className="text-2xl font-semibold">{nft.name}</h3>
    <hr/>

    <div>
        <p className="text-gray-400">{nft.description}</p>
    </div>
    <hr/>

    <div className="mb-2">
        <Tag color="blue">
                {activeChain.CHAIN_NAME}
                <img src={activeChain.LOGO_URL} alt={activeChain.CHAIN_NAME} width={25} />
        </Tag>
    </div>
    <a href={nftBlockExplorerUrl} target="_blank" rel="noreferrer" className="ml-1">
        View NFT in Block Explorer
    </a>
    </div>
    <hr/>
    <div className="p-4 bg-black">
        <p className="text-2xl mb-4 font-bold">  
        {/* <a href={sellerBlockExplorerUrl} target="_blank" rel="noreferrer" className="ml-1">
            View Seller address
        </a> */}
        </p>
        <p className="text-2xl mb-4 font-bold">{nft.price} ETH</p>
        <Button className="center block">Buy</Button>
        {/* <Button className="center block" onClick={() => buyNft(nft)}>Buy</Button> */}
    </div>
    </div>
  )
}

export default NFTCard