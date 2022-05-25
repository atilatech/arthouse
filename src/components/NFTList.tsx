import React, { useEffect, useState } from 'react'
import { Row, Col, Spin } from 'antd';
import Moralis from 'moralis';
import { components } from 'moralis/types/generated/web3Api';
import { CONFIG_CHAINS } from '../config';
import { Chain } from '../models/Chain';
import { NFTMetadata } from '../models/NFT';
import NFTCard from './NFTCard';

function NFTList({address, chainId, getAllTokensForContract = false} : {address: string, chainId: string, getAllTokensForContract?: boolean}) {

    const chainConfig = new Chain({...CONFIG_CHAINS[chainId]});
    const [nfts, setNfts] = useState<NFTMetadata[]>([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
  
    useEffect(() => {
      if (address) {
        loadNFTsByChainId()
      }
    }, [address, chainId]);
  
    async function loadNFTsByChainId() {
  
      setLoadingState(`Loading NFTs for ${chainConfig.getChainFullName()}`);
      const options = {
        // needed to resolve typescript compilation errors because "chain" was being interpreted as a string that can accept many values
        // Types of property 'chain' are incompatible.
        // Type 'string' is not assignable to type '"rinkeby" | "eth" | "0x1" | "ropsten" | "0x3" | ... N more ... |
        // see: https://bobbyhadz.com/blog/typescript-type-string-is-not-assignable-to-type
        chain: `0x${(Number.parseInt(chainId)).toString(16)}` as components["schemas"]["chainList"],
        address: address,
      };
      let data;
      if (getAllTokensForContract) {
        data = await Moralis.Web3API.token.getAllTokenIds(options);
      } else {
        data = await Moralis.Web3API.account.getNFTs(options);
      }

      const items = data.result!.filter(nft => nft.metadata).map((token) => {
        const metadata = JSON.parse(token.metadata || "{}");
        const { name, description, image } = metadata;
        // let price = token.price ? ethers.utils.formatUnits(token.price.toString(), 'ether') : "";
        let item: NFTMetadata = {
          // price,
          tokenId: token.token_id,
          // seller: token.seller,
          owner: (token as any).owner_of,
          name,
          description,
          image,
          chainId: chainId,
        }
        return item
      });
      
      console.log({items, chainId})
      setNfts(items);
      setLoadingState('loaded');
  
    }
  
    return (
      <div className="NFTList">
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

export default NFTList