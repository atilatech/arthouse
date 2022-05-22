import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  activeChainId,
  CONFIG_CHAINS,
  NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import { Button, Col, Row, Spin } from 'antd';
import NFTCard from '../../components/NFTCard';

export default function Gallery() {
  const [nfts, setNfts] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState('')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {

    setLoadingState('loading');

    /* create a generic provider and query for unsold market items */
    const rpcProviderUrl = (CONFIG_CHAINS as any)[activeChainId].RPC_PROVIDER_URL;
    const provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl)
    console.log({rpcProviderUrl, provider});

    const tokenContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, provider)
    const marketContract = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    console.log({items});
    setNfts(items)
    setLoadingState('loaded') 
  }

  async function buyNft(nft: any) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(NFT_ADDRESS, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
        <h1>NFT Gallery</h1>
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        {loadingState === "loading" && <Spin size="large"  tip="Loading NFTs..."/>}
        <Row gutter={[24,24]}>
          {
            nfts.map((nft, i) => {

              return(
                <Col md={8} sm={24} key={i}>
                  <NFTCard nft={nft} chainId={activeChainId} />
                </Col>
              )

            })
          }
        </Row>
      </div>
    </div>
  )
}
