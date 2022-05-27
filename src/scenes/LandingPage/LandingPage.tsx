import React from 'react'
import { ALL_CONFIG_CHAINS } from '../../config'
import { Chain } from '../../models/Chain';

function LandingPage() {
  return (
    <div className="container p-3">
    <div className="row">
        <div className="col-md-6">
            <h1 className="text-left">
                One House.<br/> Many Chains. <br/> Arthouse.
            </h1>
            <hr/>
            <div className="text-left">
                Arthouse is a multi-chain NFT platform. Create NFTs on multiple blockchains. <br/>

                <hr/>
                <h2>
                    Supported Chains: 
                </h2>
                <h3>
                    Main Net
                </h3>
                <ol>
                {Object.values(ALL_CONFIG_CHAINS).filter(chain => chain.IS_MAIN_NET).map (chain => {
                    chain =  new Chain({...chain});
                    return (
                        <li key={chain.CHAIN_ID}>
                        {chain.getChainFullName()}
                        <img src={chain.LOGO_URL} alt={chain.CHAIN_NAME} width={50} />
                        </li>
                    );
                })}
                </ol>
                <h3>
                    Testnets
                </h3>

                {Object.values(ALL_CONFIG_CHAINS).filter(chain => !chain.IS_MAIN_NET).map (chain => {
                    chain =  new Chain({...chain});
                    return (
                        <li key={chain.CHAIN_ID}>
                        {chain.getChainFullName()}
                        <img src={chain.LOGO_URL} alt={chain.CHAIN_NAME} width={50} />
                        </li>
                    );
                })}

            </div>
        </div>
        <div className="col-md-6 card shadow p-3">
            <img src="https://i.imgur.com/qfG9S0L.jpg" style={{width: "auto", height: "60vh"}} alt="Anime style artist" />
            {/* <img src="https://us1.storj.io/4d61a7b4-2bde-45f6-a499-00e094e040f7" style={{width: "auto", height: "60vh"}} /> */}
            <p className="p-3">
                Source: <a href="https://www.pinterest.ie/pin/528328600017362380/" target ="_blank" rel='noreferrer'>
                    Tina Martini
                </a>
            </p>
        </div>
    </div>

    </div>
  )
}

export default LandingPage