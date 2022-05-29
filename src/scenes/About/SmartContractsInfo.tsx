import React from 'react'
import { ALL_CONFIG_CHAINS } from '../../config';
import { Chain } from '../../models/Chain';

function SmartContractsInfo() {

  return (
    <div>
            
            <h2 className='text-center'>
                Smart Contracts
            </h2>

            <p>
                <a href="https://github.com/atilatech/art-house/tree/master/contracts" 
                    target="_blank" rel="noreferrer" className="center-block text-center">
                        View Smart Contract code on Github
                </a>
            </p>

            <ol>
                {Object.values(ALL_CONFIG_CHAINS).map((chain: Chain) => {

                chain = new Chain({...chain});
                const nftBlockExplorerUrl = `${chain.BLOCK_EXPLORER_URL}/${chain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${chain.NFT_ADDRESS}`;
                const nftMartplaceBlockExplorerUrl = `${chain.BLOCK_EXPLORER_URL}/${chain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${chain.NFT_ADDRESS}`;
                    
                return (
                        <li className='my-2' key={chain.CHAIN_ID}>
                            View Smart Contracts for <Chain.ChainDisplay chain={chain} />
                            <ol>
                                <li>
                                    <a href={nftBlockExplorerUrl} target="_blank" rel="noreferrer" className="center-block text-center">
                                        NFT Smart Contract on Block Explorer 
                                    </a>
                                </li>
                                <li>
                                    <a href={nftMartplaceBlockExplorerUrl} target="_blank" rel="noreferrer" className="center-block text-center">
                                        NFT Marketplace Smart Contract on Block Explorer 
                                    </a>
                                    
                                </li>
                            </ol>
                        </li>
                )
                })}
            </ol>
    </div>
  )
}

export default SmartContractsInfo