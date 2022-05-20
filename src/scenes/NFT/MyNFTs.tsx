/* pages/my-assets.js */
import React, { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import {
    NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS
} from '../../config';

import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import CreatedNFTs from './CreatedNFTs';

export default function MyNFTs() {

  const [nfts, setNfts] = useState<any>([]);
  const [createdNfts, setCreatedNfts] = useState<any>([]);
  const [soldNfts, setSoldNfts] = useState<any>([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [loadingCreatedState, setLoadingCreatedState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, Market.abi, signer)
    const tokenContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded');

    loadCreatedNFTs(marketContract, tokenContract);

  };

  async function loadCreatedNFTs(marketContract: ethers.Contract, tokenContract: ethers.Contract) {


    const data = await marketContract.fetchMyNFTs();
    const items = await Promise.all(data.map(async (i: any) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
        }
        return item
      }));

      /* create a filtered array of items that have been sold */
      const soldItems = items.filter(i => i.sold)
      setSoldNfts(soldItems)
      setCreatedNfts(items)
      setLoadingCreatedState('loaded') 
  };

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)

  return (
    <div className="MyNFTs card shadow container p-5">
      <h1>My NFTs</h1>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft: any, i: number) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
        
     {loadingCreatedState === 'loaded' && <CreatedNFTs createdNfts={createdNfts} soldNfts={soldNfts} />}
      
    </div>
  )
}
