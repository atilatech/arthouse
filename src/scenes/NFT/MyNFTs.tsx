/* pages/my-assets.js */
import React, { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import Moralis from 'moralis';
import { components } from 'moralis/types/generated/web3Api';
import { Col, Radio, RadioChangeEvent, Row, Spin } from 'antd';
import NFTCard from '../../components/NFTCard';
import { NFTMetadata } from '../../models/NFT';
import { CONFIG_CHAINS, MORALIS_SUPPORTED_CHAINS } from '../../config';
import { Chain } from '../../models/Chain';

export default function MyNFTs() {

  const [nfts, setNfts] = useState<any>([]);
  const [activeChainId, setActiveChainId] = useState(MORALIS_SUPPORTED_CHAINS[0]);
  const [activeAddress, setActiveAddress] = useState("");
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    initializeActiveAddress()
  }, []);



  useEffect(() => {
    if (activeAddress) {
      loadNFTsByChainId()
    }
  }, [activeAddress, activeChainId]);

  async function initializeActiveAddress() {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setActiveAddress(address);
  };

  async function loadNFTsByChainId() {


    const chainConfig = new Chain({...CONFIG_CHAINS[activeChainId]});

    setLoadingState(`Loading NFTs for ${chainConfig.getChainFullName()}`);
    const options = {
      // needed to resolve typescript compilation errors because "chain" was being interpreted as a string that can accept many values
      // Types of property 'chain' are incompatible.
      // Type 'string' is not assignable to type '"rinkeby" | "eth" | "0x1" | "ropsten" | "0x3" | ... N more ... |
      // see: https://bobbyhadz.com/blog/typescript-type-string-is-not-assignable-to-type
      chain: `0x${(Number.parseInt(activeChainId)).toString(16)}` as components["schemas"]["chainList"],
      address: activeAddress,
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
        chainId: activeChainId,
      }
      return item
    });
    
    console.log({items, activeChainId})
    setNfts(items);
    setLoadingState('loaded');

  }

  const onChangeActiveChainId = (event: RadioChangeEvent) => {
    setActiveChainId(event.target.value);
  }

  return (
    <div className="MyNFTs card shadow container p-5">
      <h1>My NFTs</h1>
      <Radio.Group onChange={onChangeActiveChainId} value={activeChainId} optionType="button" className="mb-2">
      {
        MORALIS_SUPPORTED_CHAINS.map(chainId => {
          const chain = new Chain({...CONFIG_CHAINS[chainId]});
          return (
          <Radio.Button value={chain.CHAIN_ID}>
            {chain.getChainFullName()}
          </Radio.Button> 
            )
        }
          
        )
      }
      </Radio.Group>
      {loadingState === 'loaded' && !nfts.length &&
       <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
      }
      {loadingState?.toLowerCase().includes("loading") && <Spin size="large"  tip={loadingState}/>}
      
      <Row gutter={[24,24]}>
          {
            nfts.map((nft: NFTMetadata, i: number) => {

              return(
                <Col md={8} sm={24} key={i}>
                  <NFTCard nft={nft} />
                </Col>
              )

            })
          }
      </Row>
    </div>
  )
}
