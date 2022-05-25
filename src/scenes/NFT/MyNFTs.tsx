/* pages/my-assets.js */
import React, { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import { Radio, RadioChangeEvent } from 'antd';
import { CONFIG_CHAINS, MORALIS_SUPPORTED_CHAINS } from '../../config';
import { Chain } from '../../models/Chain';
import NFTList from '../../components/NFTList';

export default function MyNFTs() {
  const [activeChainId, setActiveChainId] = useState(MORALIS_SUPPORTED_CHAINS[0]);
  const [activeAddress, setActiveAddress] = useState("");

  useEffect(() => {
    initializeActiveAddress()
  }, []);

  async function initializeActiveAddress() {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setActiveAddress(address);
  };

  const onChangeActiveChainId = (event: RadioChangeEvent) => {
    setActiveChainId(event.target.value);
  }

  return (
    <div className="MyNFTs card shadow container p-5">
      <h1>My NFTs</h1>
      <Radio.Group onChange={onChangeActiveChainId} value={activeChainId} optionType="button" className="my-3">
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
      
      <NFTList address={activeAddress} chainId={activeChainId} />
    </div>
  )
}
