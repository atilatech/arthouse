import React, { useState } from 'react'
import { Alert, AlertProps, Button, Spin } from 'antd'
import { BigNumber, ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { CONFIG_CHAINS } from '../config';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { Chain } from '../models/Chain';
import CryptoPrice from './CryptoPrice';

function AccountSales() {
  
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner|null>(null);
    const [chainCredits, setChainCredits] = useState<{[chainId: string]: BigNumber}>({});
    const [responseMessage, setResponseMessage] = useState<{[key: string]: {message: string, type: AlertProps["type"], loading?: boolean} | null}>({});

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

        const activeChain = new Chain({...CONFIG_CHAINS[chainId]});
        setResponseMessage({
            ...responseMessage,
            [chainId]: {
                type: "info",
                message: `Loading Sales on ${activeChain.getChainFullName()}`,
                loading: true,
                }
            });
        try {
        const activeSigner = await getSigner();
        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, activeSigner);
        
        const signerAddress = await activeSigner.getAddress()
        const addressCredits = await marketContract.getAddressCredits(signerAddress);
        setChainCredits({
            ...chainCredits,
            [chainId]: addressCredits,
        })
        setResponseMessage({
            ...responseMessage,
            chainId: null
            });

        return addressCredits
        } catch (error) {
            setResponseMessage({
                ...responseMessage,
                [chainId]: {
                    type: "error",
                    message: JSON.stringify(error),
                    }
                });
        }
    }

    const withdrawCredits = async (chainId :string) => {

        const activeChain = new Chain({...CONFIG_CHAINS[chainId]});
        setResponseMessage({
            ...responseMessage,
            [chainId]: {
                type: "info",
                message: `Loading Sales on ${activeChain.getChainFullName()}`,
                loading: true,
                }
            });
        try {
            
        const activeSigner = await getSigner();
        const marketContract = new ethers.Contract(activeChain.NFT_MARKETPLACE_ADDRESS, Market.abi, activeSigner);

        await marketContract.withdrawCredits();

        // in theory, the credits may not be zero and we should fetch the updated value from the blockchain
        // but for simplicity, we can assume that after withdrawing all credits the balance is zero.
        // User can always trigger another get balance request if they want to see an updated balance.
        setChainCredits({
            ...chainCredits,
            [chainId]: BigNumber.from(0),
        })


        setResponseMessage({
            ...responseMessage,
            [chainId]: {
                type: "info",
                message: `Withdrew sales to your wallet from: ${activeChain.getChainFullName()}`,
                }
            });
        } catch (error) {
            setResponseMessage({
                ...responseMessage,
                [chainId]: {
                    type: "error",
                    message: JSON.stringify(error),
                    }
                });
            
        }
    }

  return (
    <div>

        <h1 className='text-center'>My Sales</h1>
        <p className='text-center'>
            Sales you've made on each chain.
        </p>
        <table className='table table-responsive'>
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
                const response = responseMessage[chainId];
                const chainCredit = chainCredits[chainId]|| BigNumber.from(0);

                return (
                    <tr key={chainId}>
                        <td>
                            <Chain.ChainDisplay chain={chain} />  
                        </td>
                        <td>
                            <Button onClick={()=>getBalance(chainId)} className='mx-3 my-sm-2'>
                                Get Balance
                            </Button>    
                            <Button onClick={()=>withdrawCredits(chainId)} className='mx-3 my-sm-2'>
                                Withdraw money to my Wallet
                            </Button>
                        </td>
                        <td>
                            <CryptoPrice cryptoPrice={chainCredit} currencySymbol={chain.CURRENCY_SYMBOL} />
                            {response && 
                                <Alert
                                    key={response.message}
                                    type={response.type}
                                    message={<>
                                    {response.message}{' '}
                                    {response.loading && <Spin />}
                                    </>
                                    }
                                    style={{maxWidth: '300px'}}
                                    className="my-2"
                                />
                            }
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

export default AccountSales