import React from 'react'
import { CONFIG_CHAINS } from '../../config'

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
                Create NFTs on multiple blockchains. <br/>

                Supported Chains: <br/>
                <ol>
                {Object.values(CONFIG_CHAINS).map (chainConfig => {
                    return (
                        <li key={chainConfig.CHAIN_ID}>
                        {chainConfig.CHAIN_NAME}
                        <img src={chainConfig.LOGO_URL} alt={chainConfig.CHAIN_NAME} width={50} />
                        </li>
                    );
                })}
                </ol>
            </div>
        </div>
        <div className="col-md-6 card shadow p-3">
            <img src="https://i.imgur.com/qfG9S0L.jpg" style={{width: "auto", height: "60vh"}} />
            {/* <img src="https://us1.storj.io/4d61a7b4-2bde-45f6-a499-00e094e040f7" style={{width: "auto", height: "60vh"}} /> */}
            <p className="p-3">
                Source: <a href="https://www.pinterest.ie/pin/528328600017362380/" target ="_blank">
                    Tina Martini
                </a>
            </p>
        </div>
    </div>

    </div>
  )
}

export default LandingPage