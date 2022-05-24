/* pages/my-assets.js */
import React, { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import Moralis from 'moralis';
import { components } from 'moralis/types/generated/web3Api';
import { Col, Row, Spin } from 'antd';
import NFTCard from '../../components/NFTCard';
import { NFTMetadata } from '../../models/NFT';
import { CONFIG_CHAINS, MORALIS_SUPPORTED_CHAINS } from '../../config';

export default function MyNFTs() {

  const [nfts, setNfts] = useState<any>([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs()
  }, []);

  async function loadNFTs() {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const allNFTs: NFTMetadata[] = [];
    MORALIS_SUPPORTED_CHAINS.forEach(async chainId => {

      try {
        const chainNFTs: NFTMetadata[] =  await loadNFTsByChainId(address, chainId);

        allNFTs.push(...chainNFTs);
        console.log({chainNFTs, allNFTs});
        setNfts(allNFTs);
      } catch (error) {
          console.log(error);
        }
    });

    setNfts(allNFTs);
    console.log({allNFTs})
    setLoadingState('loaded');

  };

  async function loadNFTsByChainId(address: string, chainId: string) {


    const chainConfig = CONFIG_CHAINS[chainId];
    const networkFullName = `${chainConfig.CHAIN_NAME} (${chainConfig.NETWORK_NAME})`;

    setLoadingState(`Loading NFTs for ${networkFullName}`);
    const options = {
      // needed to resolve typescript compilation errors because "chain" was being interpreted as a string that can accept many values
      // Types of property 'chain' are incompatible.
      // Type 'string' is not assignable to type '"rinkeby" | "eth" | "0x1" | "ropsten" | "0x3" | ... N more ... |
      // see: https://bobbyhadz.com/blog/typescript-type-string-is-not-assignable-to-type
      chain: `0x${(Number.parseInt(chainId)).toString(16)}` as components["schemas"]["chainList"],
      address,
    };
    const data = await Moralis.Web3API.account.getNFTs(options);

    const items = data.result!.filter(nft => nft.metadata).map((token) => {
      const metadata = JSON.parse(token.metadata || "{}");
      const { name, description, image } = metadata;
      // let price = token.price ? ethers.utils.formatUnits(token.price.toString(), 'ether') : "";
      let item: NFTMetadata = {
        // price,
        tokenId: token.token_id,
        // seller: token.seller,
        owner: token.owner_of,
        name,
        description,
        image,
        chainId,
      }
      return item
    });
    return items;
  }

  return (
    <div className="MyNFTs card shadow container p-5">
      <h1>My NFTs</h1>
      {loadingState === 'loaded' && !nfts.length &&
       <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
      }
      {loadingState?.toLowerCase().includes("loading") && <Spin size="large"  tip={loadingState}/>}
      
      <Row gutter={[24,24]}>
          {
            nfts.map((nft: NFTMetadata, i: number) => {

              return(
                <Col md={8} sm={24} key={i}>
                  <NFTCard nft={nft} chainId={"4"} />
                </Col>
              )

            })
          }
      </Row>
    </div>
  )
}
