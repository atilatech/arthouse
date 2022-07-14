import React from 'react'
import { Tag } from 'antd';
import { CONFIG_CHAINS } from '../config';
import { NFTMetadata } from '../models/NFT';

import "./NFTCard.scss";
import { MarketplaceDisplay } from '../models/Marketplace';

function NFTCard({nft}: {nft: NFTMetadata}) {
    const { chainId } = nft;

    const activeChain = CONFIG_CHAINS[chainId!];
    const nftBlockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/${activeChain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${activeChain.NFT_ADDRESS}?a=${nft.tokenId}`;

    return (
        <div className="NFTCard card shadow">
        <img src={nft.image}  alt={nft.name} width="auto" height="300" className="m-3"/>
        <div className="p-4">
        <h3 className="text-2xl font-semibold">{nft.name}</h3>
        <hr/>

        <div className="description">
            <p>{nft.description}</p>
        </div>
        <hr/>

        <div className="mb-2 metadata">
            <Tag color="blue" className='mb-2'>
                    {activeChain.CHAIN_NAME}
                    <img src={activeChain.LOGO_URL} alt={activeChain.CHAIN_NAME} width={25} />
            </Tag><br/>
            <a href={nftBlockExplorerUrl} target="_blank" rel="noreferrer" className="ml-1">
                View NFT on Block Explorer
            </a>
            <MarketplaceDisplay.ListedMarketplaces chain={activeChain} nft={nft} />
        </div>
        </div>
        </div>
    )
}

export default NFTCard