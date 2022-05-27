import React, { useState } from 'react';

import {
  CONFIG_CHAINS,
  MORALIS_SUPPORTED_CHAINS,
} from '../../config'

import { Radio } from 'antd';
import NFTList from '../../components/NFTList';
import { Chain } from '../../models/Chain';

export default function Gallery() {
  const [activeChainId, setActiveChainId] = useState(Object.keys(CONFIG_CHAINS)[0]);


  const onChangeActiveChainId = (updatedChainId: string) => {
    setActiveChainId(updatedChainId);
  };

  const activeChain = CONFIG_CHAINS[activeChainId];

  return (
    <div className="Gallery card shadow container p-5">
        <h1>NFT Gallery</h1>
        <Radio.Group onChange={event => onChangeActiveChainId(event.target.value)} value={activeChainId} optionType="button" className="my-3">
        {
          MORALIS_SUPPORTED_CHAINS
          .filter(chainId =>Object.keys(CONFIG_CHAINS).includes(chainId))
          .map(chainId => {
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

      <NFTList address={activeChain.NFT_ADDRESS} chainId={activeChain.CHAIN_ID} getAllTokensForContract={true} />
    </div>
  )
}
