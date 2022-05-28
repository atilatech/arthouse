import React from 'react'
import NotionPage from '../../components/NotionPage'
import ResponsiveEmbed from '../../components/ResponsiveEmbed'
import { ALL_CONFIG_CHAINS } from '../../config';
import { Chain } from '../../models/Chain';

function About() {
  return (
    <div className="container">
        <h1 className='text-center'>
            About Art House
        </h1>

        <div className="section card shadow m-5 p-5">
            <NotionPage pageId="37ec10d7c96b4bd1b77f3ac42115dbda" showTableOfContents={false} className="p-2" />
        </div>

        <div className="section card shadow m-5 p-5">
            
            <h2 className='text-center'>
                Smart Contracts
            </h2>

            <ol>
                {Object.values(ALL_CONFIG_CHAINS).map((chain: Chain) => {

                chain = new Chain({...chain});
                const nftBlockExplorerUrl = `${chain.BLOCK_EXPLORER_URL}/${chain.CHAIN_NAME !== "Harmony" ? "token": "address"}/${chain.NFT_ADDRESS}`;
                    
                return (
                        <li className='my-2' key={chain.CHAIN_ID}>
                            <a href={nftBlockExplorerUrl} target="_blank" rel="noreferrer" className="center-block text-center">
                                View {chain.getChainFullName()} NFT Contract on Block Explorer  <img src={chain.LOGO_URL} alt={chain.CHAIN_NAME} width={25} />
                            </a>
                        </li>
                )
                })}
            </ol>
        </div>

        <div className="section card shadow m-5 p-5">
            <ResponsiveEmbed 
            srcUrl="https://docs.google.com/presentation/d/e/2PACX-1vS-k9mCJsoNLKiPlqSCz01SUxlCZvHZAWfn3ahgZGSXLMZB1bqIrj-NcB2pZ38-Ik4sdd73QNWoJJJ1/embed?start=false&loop=false&delayms=3000"
            title="Arthouse Presentation" />
        </div>

        <div className="section card shadow m-5 p-5">
            <ResponsiveEmbed srcUrl="https://www.loom.com/embed/c4205883b8fd4e499eadf1e349c8ace6?from_link_expand=true&?session_id=c4205883b8fd4e499eadf1e349c8ace6&hide_owner=undefined&hide_speed=undefined&hide_share=undefined&hide_title=undefined&from_url=https%3A%2F%2Fgithub.com%2Fatilatech%2Fart-house" />
        </div>
        
    </div>
  )
}

export default About