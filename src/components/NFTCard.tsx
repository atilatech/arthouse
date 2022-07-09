import React, { useState } from 'react'
import { Alert, AlertProps, Button, Spin, Tag } from 'antd';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { CONFIG_CHAINS } from '../config';
import { NFTMetadata } from '../models/NFT';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

import "./NFTCard.scss";
import { BigNumber, ethers } from 'ethers';
import Web3Modal from 'web3modal';
import CryptoPrice from './CryptoPrice';
import CryptoPriceEdit from './CryptoPriceEdit';
import { MarketplaceDisplay } from '../models/Marketplace';

function NFTCard({nft}: {nft: NFTMetadata}) {

    const [listPrice, setListPrice] = useState<BigNumber>(BigNumber.from(0));
    const [showEditListPrice, setShowEditListPrice] = useState(false);
    const { chainId } = nft;
    let signer: ethers.providers.JsonRpcSigner;
    const [responseMessage, setResponseMessage] = useState<{[key: string]: {message: string, type: AlertProps["type"], loading?: boolean}}>({});

    const activeChain = CONFIG_CHAINS[chainId!];
    const nftBlockExplorerUrl = `${activeChain.BLOCK_EXPLORER_URL}/${activeChain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${activeChain.NFT_ADDRESS}?a=${nft.tokenId}`;

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
        
        /* then list the item for sale on the marketplace */
        signer = await getSigner()

        const nftContract = new ethers.Contract(activeChain.NFT_ADDRESS, NFT.abi, signer);
        
        const signerAddress = await signer.getAddress()
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
            // todo because we don't hide listNFT for non-owners, a user may call setApprovalForAll and then end up not being able to list the token
            // we should make sure the user is the owner of this token or hide this button if not owner 
            await nftContract.setApprovalForAll(activeChain.NFT_MARKETPLACE_ADDRESS, true);
        }

        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, signer);
  
        await marketContract.createMarketItem(activeChain.NFT_ADDRESS, nft.tokenId, listPrice);
        setResponseMessage({
            ...responseMessage,
            listNFT: {
               type: "success",
               message: "Succesfully listed market item for sale",
             }
             });
        } catch (error: any) {
            setResponseMessage({
                ...responseMessage,
                listNFT: {
                   type: "error",
                   message: error?.data?.message||JSON.stringify(error),
                 }
                 });
        }
    };


    const buyNFT = async  () => {

        if (!nft.price) {
            setResponseMessage({
                ...responseMessage,
                buyNFT: {
                   type: "error",
                   message: "This NFT does not have a price. It's unavailable for purchase.",
                   loading: true,
                 }
                 });
                 return;
        }
        try {

        
        /* then list the item for sale on the marketplace */
        signer = await getSigner()

        setResponseMessage({
            ...responseMessage,
            buyNFT: {
               type: "info",
               message: "Completing purchase",
               loading: true,
             }
             });
        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, signer);
        const { price } = nft;

        await marketContract.createMarketSale(activeChain.NFT_ADDRESS, nft.itemId, { value: price});
        setResponseMessage({
            ...responseMessage,
            buyNFT: {
               type: "success",
               message: "Succesfully purchased item",
             }
             });
        } catch(error: any) {
            setResponseMessage({
                ...responseMessage,
                buyNFT: {
                   type: "error",
                   message: error.message || error?.data?.message||JSON.stringify(error),
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
            <>
            {showEditListPrice ? 
            <>
                <CryptoPriceEdit currencySymbol={activeChain.CURRENCY_SYMBOL} onPriceChange={({cryptoPrice}) => {
                    if(cryptoPrice) {
                        setListPrice(cryptoPrice);
                    }
                }} />
                <Button onClick={listNFT} className="mb-3">
                    List for Sale
                </Button>
            </>
            :
                <Button onClick={()=>setShowEditListPrice(true)} className="mb-3">
                    List for Sale
                </Button>
            }
             <br/>
            </>

            {nft.price && nft.price.gt(0) && 
            
                <Button onClick={buyNFT}>
                    Buy <CryptoPrice cryptoPrice={nft.price as BigNumber} currencySymbol={activeChain.CURRENCY_SYMBOL} />
                </Button>
            }


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
            <MarketplaceDisplay.ListedMarketplaces chain={activeChain} nft={nft} />
        </div>
        </div>
        </div>
    )
}

export default NFTCard