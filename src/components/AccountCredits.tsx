import React, { useState } from 'react'
import { Button } from 'antd'
import { BigNumber, ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { CONFIG_CHAINS } from '../config';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { Chain } from '../models/Chain';
import CryptoPrice from './CryptoPrice';

function AccountCredits() {
  
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner|null>(null);
    const [chainCredits, setChainCredits] = useState<{[chainId: string]: number}>({})

    const getSigner = async () => {

        if(signer) {
            return signer;
        } else {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)    
            
            let newSigner  =  provider.getSigner();
            setSigner(newSigner);
            return newSigner
        }
    }

    const getBalance = async (chainId :string) => {
        const activeSigner = await getSigner();
        const activeChain = CONFIG_CHAINS[chainId];
        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, activeSigner);
        
        const signerAddress = await activeSigner.getAddress()
        let addressCredits = await marketContract.getAddressCredits(signerAddress);
        addressCredits = Number.parseFloat(addressCredits.toString());
        setChainCredits({
            ...chainCredits,
            [chainId]: addressCredits,
        })

        return addressCredits
    }

    const withdrawCredits = async (chainId :string) => {
        const activeSigner = await getSigner();
        const activeChain = CONFIG_CHAINS[chainId];
        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, activeSigner);
        
        const signerAddress = await activeSigner.getAddress()
        let addressCredits = await marketContract.getAddressCredits(signerAddress);
        addressCredits = Number.parseFloat(addressCredits.toString());
        setChainCredits({
            ...chainCredits,
            [chainId]: addressCredits,
        })

        await getBalance(chainId)
    }

  return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>
                        Chain
                    </th>
                    <th>
                        Actions
                    </th>
                    <th>
                        Balance
                    </th>
                </tr>
            </thead>
            <tbody>
            {Object.values(CONFIG_CHAINS).map( chain => {

                chain = new Chain({...chain})
                const chainId = chain.CHAIN_ID;

                return (
                    <tr key={chainId}>
                        <td>
                            <Chain.ChainDisplay chain={chain} />  
                        </td>
                        <td>
                            <Button onClick={()=>getBalance(chainId)}>
                                Get Balance
                            </Button>    
                            <Button onClick={()=>withdrawCredits(chainId)}>
                                Withdraw Credits
                            </Button>
                        </td>
                        <td>
                            <CryptoPrice cryptoPrice={BigNumber.from(chainCredits[chainId]||0)} currencySymbol={chain.CURRENCY_SYMBOL} />
                        </td>
                    </tr>
                )
                }
                )}
            </tbody>
        </table>
    </div>
  )
}

export default AccountCredits