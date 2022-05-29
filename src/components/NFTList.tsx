import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Spin } from 'antd';
import Moralis from 'moralis';
import { components } from 'moralis/types/generated/web3Api';
import { CONFIG_CHAINS } from '../config';
import { Chain } from '../models/Chain';
import { NFTMetadata } from '../models/NFT';
import NFTCard from './NFTCard';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

function NFTList({address, chainId, getAllTokensForContract = false} : {address: string, chainId: string, getAllTokensForContract?: boolean}) {

    const [nfts, setNfts] = useState<NFTMetadata[]>([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    /**
       * If we weant to pass a function to useEffect we must memoize the function to prevent an infinite loop re-render.
       * This is because functions change their reference each time a component is re-rendered.
       * Instead, we only want to rerender when the userProfileLoggedIn.user reference inside the getWallets() function is changed
       * see: https://stackoverflow.com/a/62601621
    */
     const loadNFTsByChainId = useCallback(
      async () => {

        if (!address) {
          return
        }

      const chainConfig = new Chain({...CONFIG_CHAINS[chainId]});
  
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

      let items = await Promise.all(data.result!.map(async (token) => {
        let metadata;
        if (!token.metadata && token.token_uri) {
          // Moralis doesn't fetch the metadata from URI immediately so we may have to manually fetch it ourselves
          metadata = (await axios.get(token.token_uri)).data || {};
        } else {
          metadata = JSON.parse(token.metadata || "{}");
        }
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
      }));

      if(window.ethereum) {

        try {
          // get the NFTs held by the Market smart contract and merge the listing details with the NFTs returned from the NFT Smart Contract
          const web3Modal = new Web3Modal()
          const connection = await web3Modal.connect()
          const provider = new ethers.providers.Web3Provider(connection)    
          const signer = provider.getSigner()

          let marketItems: {[key:string]: Partial<NFTMetadata>} = {};
          const marketContract = new ethers.Contract(chainConfig.NFT_MARKETPLACE_ADDRESS, Market.abi, signer);
          (await marketContract.fetchMarketItems())
          .filter((token: any) => token.owner === chainConfig.NFT_MARKETPLACE_ADDRESS)
          .forEach((marketItem: NFTMetadata) => {
            marketItems[marketItem.tokenId.toString()] = {
              seller: marketItem.seller,
              itemId: marketItem.itemId,
              price: marketItem.price
            }
          });
          items = items.map(item => {
            if (!marketItems[item.tokenId]) {
              return item
            } else {
              const marketItem = marketItems[item.tokenId];
              return {
                ...item,
                seller: marketItem.seller,
                itemId: marketItem.itemId,
                price: marketItem.price
              }
            }
          });

        } 
        catch (error) {
          console.log({error});
        }
      }

      setNfts(items);
      setLoadingState('loaded');
  
    }, [address, chainId, getAllTokensForContract]);

    useEffect(() => {
      loadNFTsByChainId();
    }, [ loadNFTsByChainId]);

  
    return (
      <div className="NFTList">
      {loadingState === 'loaded' && !nfts.length &&
       <h1 className="py-10 px-20 text-3xl">No assets found</h1>
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