import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  activeChainId,
  CONFIG_CHAINS,
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import { Button, Col, Row, Spin } from 'antd';
import NFTCard from '../../components/NFTCard';
import { NFTMetadata } from '../../models/NFT';

export default function Gallery() {
  const [nfts, setNfts] = useState<{[key: string]: NFTMetadata[]}>({})
  const [loadingState, setLoadingState] = useState('')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {


    Object.keys(CONFIG_CHAINS).forEach( async (chainId) => {
      await loadNFTsByChainID(chainId);
    })
  }

  const loadNFTsByChainID = async (activeChainId: string)  => {

    /* create a generic provider and query for unsold market items */
    const rpcProviderUrl = (CONFIG_CHAINS as any)[activeChainId].RPC_PROVIDER_URL;
    const provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl)
    console.log({rpcProviderUrl, provider});
    const chainConfig = CONFIG_CHAINS[activeChainId];
    const networkFullName = `${chainConfig.CHAIN_NAME} (${chainConfig.NETWORK_NAME})`;

    setLoadingState(`Loading NFTs for ${networkFullName}`);

    const tokenContract = new ethers.Contract(chainConfig.NFT_ADDRESS, NFT.abi, provider)
    const marketContract = new ethers.Contract(chainConfig.NFT_MARKETPLACE_ADDRESS, Market.abi, provider)
    // Get a function to return even NFTs not on smart contract network
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item: NFTMetadata = {
        price,
        itemId: i.itemId.toNumber(),
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        chainId: activeChainId,
      }
      return item
    }))
    
    console.log(chainConfig.NETWORK_NAME, {items});
    const updatedNFTs = {...nfts};
    updatedNFTs[activeChainId] = items;

    setNfts(updatedNFTs);
    console.log(chainConfig.NETWORK_NAME, {updatedNFTs});
    setLoadingState('loaded');
  }

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
    await transaction.wait()
    loadNFTs()
  }

  const nftArrays =  Object.values(nfts);
  const allNFTs: NFTMetadata[] = [].concat.apply([] as NFTMetadata[], (nftArrays as any));

  console.log({allNFTs, nfts, nftArrays});


  if (loadingState === 'loaded' && !allNFTs.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
        <h1>NFT Gallery</h1>

        {Object.values(CONFIG_CHAINS).map(chainConfig => {
          const nftBlockExplorerUrl = `${chainConfig.BLOCK_EXPLORER_URL}/${chainConfig.CHAIN_NAME !== "Harmony" ? "token": "address"}/${chainConfig.NFT_ADDRESS}`;

          const networkFullName = `${chainConfig.CHAIN_NAME} (${chainConfig.NETWORK_NAME})`;
          return (
            <div>
              <Button className="center-block my-2" type="primary" onClick={()=>loadNFTsByChainID(chainConfig.CHAIN_ID)}>
                Load NFTs on {networkFullName}
              </Button>
            </div>
          )
        })}
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        {loadingState?.toLowerCase().includes("loading") && <Spin size="large"  tip={loadingState}/>}
        <Row gutter={[24,24]}>
          {
            allNFTs.map((nft, i) => {

              return(
                <Col md={8} sm={24} key={i}>
                  <NFTCard nft={nft} />
                </Col>
              )

            })
          }
        </Row>
      </div>
    </div>
  )
}
