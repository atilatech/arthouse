import React, { useState } from 'react'
import { Alert, AlertProps, Button, Spin, Tag } from 'antd';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { CONFIG_CHAINS, LOOKSRARE_SUPPORTED_CHAINS, OPENSEA_SUPPORTED_CHAINS, RARIBLE_SUPPORTED_CHAINS } from '../config';
import { NFTMetadata } from '../models/NFT';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

import "./NFTCard.scss";
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

function NFTCard({nft}: {nft: NFTMetadata}) {

    const { chainId } = nft;
    let signer: ethers.providers.JsonRpcSigner;
    const [responseMessage, setResponseMessage] = useState<{[key: string]: {message: string, type: AlertProps["type"], loading?: boolean}}>({});

    const activeChain = CONFIG_CHAINS[chainId];
    const nftBlockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/${activeChain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${activeChain.NFT_ADDRESS}?a=${nft.tokenId}`;

    const openSeaUrl = OPENSEA_SUPPORTED_CHAINS.includes(chainId) ? `https://${activeChain.IS_MAIN_NET? "" : "testnets."}opensea.io/assets/${activeChain.NETWORK_NAME.toLowerCase()}/${activeChain.NFT_ADDRESS}/${nft.tokenId}`: "";
    const raribleUrl = RARIBLE_SUPPORTED_CHAINS.includes(chainId) ? `https://${activeChain.IS_MAIN_NET? "" : "rinkeby."}rarible.com/token/${activeChain.NFT_ADDRESS.toLowerCase()}:${nft.tokenId}`: "";
    const looksrareUrl = LOOKSRARE_SUPPORTED_CHAINS.includes(chainId) ? `https://${activeChain.IS_MAIN_NET? "" : "rinkeby."}looksrare.org/collections/${activeChain.NFT_ADDRESS.toLowerCase()}/${nft.tokenId}`: "";

    const getSigner = async () => {
        if(signer) {
            return signer
        } else {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)    
            return provider.getSigner()
        }
    }

    const listNFT = async  () => {

        try {

        const price = ethers.utils.parseUnits('0.25', 'ether');
        /* then list the item for sale on the marketplace */
        signer = await getSigner()

        const nftContract = new ethers.Contract(activeChain.NFT_ADDRESS, NFT.abi, signer);
        
        const signerAddress = await signer.getAddress()
        console.log("signer._address, activeChain.NFT_MARKETPLACE_ADDRESS", signerAddress, activeChain.NFT_MARKETPLACE_ADDRESS);
        const isApprovedForAll = await nftContract.isApprovedForAll(signerAddress, activeChain.NFT_MARKETPLACE_ADDRESS);
        
        if (!isApprovedForAll) {
            setResponseMessage({
            ...responseMessage,
            listNFT: {
                type: "info",
                message: "In order to list this item, you will be asked to give permission to transfer your NFT to this market place.\n"+
                "You can always unlist it in the future and have the NFT transferred back to you.",
                }
            });

            await nftContract.setApprovalForAll(activeChain.NFT_MARKETPLACE_ADDRESS, true);
        }


        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, signer);
        console.log({price, nft}, price.toString());
  
        const listTransactionPromise = await marketContract.createMarketItem(activeChain.NFT_ADDRESS, nft.tokenId, price);
        const listTransaction = await listTransactionPromise.wait();
        console.log({listTransaction});
        } catch (error: any) {
            console.log({error})
            setResponseMessage({
                ...responseMessage,
                listNFT: {
                   type: "error",
                   message: error?.data?.message||JSON.stringify(error),
                 }
                 });
        }
    };


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

        <div className="actions">
            <Button onClick={listNFT}>
                Sell
            </Button>


            {Object.values(responseMessage).filter(response=>response.message).map(response => (
            <Alert
                key={response.message}
                type={response.type}
                message={<>
                {response.message}{' '}
                {response.loading && <Spin />}
                </>
                }
                style={{maxWidth: '300px'}}
                className="my-2"
                />
            ))}
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
        </div>
        {/* TODO: add support for buying and selling NFTs */}
        {/* <Button className="center block" onClick={() => buyNft(nft)}>Buy</Button> */}
        </div>
    )
}

export default NFTCard