import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal';

import {
    CONFIG_CHAINS
  } from '../../config';

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import { Alert, AlertProps, Button, Col, Input, Row, Select, Spin } from 'antd'
import './CreateNFT.scss';
import NFTCard from '../../components/NFTCard';
import { NFTMetadata } from '../../models/NFT';
import { Chain } from '../../models/Chain';

const { Option } = Select;

const { TextArea } = Input;

const ipfsHostUrl = 'https://ipfs.infura.io:5001/api/v0';
const client = (ipfsHttpClient as any)(ipfsHostUrl);

function CreateNFT() {
  
  const [fileUrl, setFileUrl] = useState<string|null>(null)
  const [formInput, updateFormInput] = useState({ price: 0, name: '', description: '' })
  const [error, setError] = useState("");
  const [selectedChains, setSelectedChains] = useState(Object.values(CONFIG_CHAINS).map(config=>config.CHAIN_ID));
  const [createdNFTs, setCreatedNFTs] = useState<NFTMetadata[]>([]);
  const [nftMetadataUrl, setNftMetadataUrl] = useState("");
  const [createNFTResponseMessage, setCreateNFTResponseMessage] = useState<{[key: string]: {message: string, type: AlertProps["type"], loading?: boolean}}>({});

  async function onChange(e: any) {
    const file = e.target.files[0];
    // setFileUrl("https://atila.ca/static/media/atila-upway-logo-gradient-circle-border.bfe05867.png");
    // return;
    try {
      const added = await client.add(
        file,
        {
          progress: (progressValue: any) => console.log(`received: ${progressValue}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error);
      setError(JSON.stringify(error));
    }  
  }
  async function getNFTMetadataUrl () {

    if (nftMetadataUrl) {
      return nftMetadataUrl;
    }
    try {
      let url;
      const { name, description } = formInput
      if (!name || !description || !fileUrl) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
          name, description, image: fileUrl
        })

        const added = await client.add(data)
        url = `https://ipfs.infura.io/ipfs/${added.path}`
        // url = "https://bafybeicjitpyvkvqrm63pnfwv2e7wxkqb6meg3vemz6s7cyc4bpcuaz44y.ipfs.infura-ipfs.io/"
        /* after file is uploaded to IPFS, pass the URL to save it on Network */
        setNftMetadataUrl(url);
        return url;

    } catch (error) {
      console.log('Error uploading file: ', error)
    } 

  };

  async function createNFT(listNFT=true, activeChainId: string) {
    try {
      mintAndListNFT(listNFT, activeChainId);
    } catch {
      setError(JSON.stringify(error));
    }
  }

  function handleChangeSelectedChains(value: any) {
    setSelectedChains(value);
  }

  async function mintAndListNFT(listNFT= true, activeChainId: string) {

    const activeChain = new Chain({...CONFIG_CHAINS[activeChainId]});
    const url = await getNFTMetadataUrl();

    if (!url) {
      setCreateNFTResponseMessage({
        ...createNFTResponseMessage,
         [activeChain.CHAIN_ID]: {
           type: "error",
           message: "Missing NFT url data. Try reuploading your NFT or refreshing the page.",
         }
         });
        return
    }
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

      if (window.ethereum.networkVersion !== activeChainId) {
        setError("Switch to the correct chain and try again");
        // switch to the correct network
        await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
            chainId: `0x${(Number.parseInt(activeChain.CHAIN_ID)).toString(16)}`,
        }]
      });
        return;
      } else {
        setError("");
      }

      
      const NFT_ADDRESS = activeChain.NFT_ADDRESS;
      const NFT_MARKETPLACE_ADDRESS = activeChain.NFT_MARKETPLACE_ADDRESS;

      /* next, create the item */
      const updatedcreateNFTResponseMessage = {...createNFTResponseMessage};
      updatedcreateNFTResponseMessage[activeChain.CHAIN_ID] = {
        message: `Minting NFT on ${activeChain.getChainFullName()}`,
        type: "info",
        loading: true,
      };
      setCreateNFTResponseMessage(updatedcreateNFTResponseMessage);
      try {

        let contract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer)
        let mintTransactionPromise = await contract.createToken(url)
        let mintTransaction = await mintTransactionPromise.wait()
        let event = mintTransaction.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        let listTransaction;
  
        console.log({mintTransaction, url});
  
        if (listNFT) {
  
          const price = ethers.utils.parseUnits(formInput.price.toString(), 'ether');
          /* then list the item for sale on the marketplace */
          contract = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, Market.abi, signer)
          let listingPrice = await contract.getListingPrice()
          listingPrice = listingPrice.toString()
    
          const listTransactionPromise = await contract.createMarketItem(NFT_ADDRESS, tokenId, price, { value: listingPrice })
          listTransaction = await listTransactionPromise.wait()
        }
        const { name, description, price: nftPrice } = formInput
        const createdNFT: NFTMetadata = {
          name,
          description,
          price: nftPrice.toString(),
          image: fileUrl || "",
          // url,
          tokenId,
          // tokenAddress: activeChain.NFT_ADDRESS,
          chainId: activeChain.CHAIN_ID,
          // chain: activeChain,
          // mintTransaction,
          seller: listTransaction?.to || "",
        }
  
        const updatedCreatedNFTs = [...createdNFTs];
  
        updatedCreatedNFTs.push(createdNFT);
        setCreatedNFTs(updatedCreatedNFTs);
        setCreateNFTResponseMessage({
          ...updatedcreateNFTResponseMessage,
           [activeChain.CHAIN_ID]: {
             type: "success",
             message: `Finished creating NFT on ${activeChain.getChainFullName()}`,
           }
           });
      } catch (error: any) {
        console.log(error);
        setCreateNFTResponseMessage({
          ...updatedcreateNFTResponseMessage,
           [activeChain.CHAIN_ID]: {
             type: "error",
             message: error.message || JSON.stringify(error),
           }
           });
      }
      

  }

  return (
    <div className="CreateNFT card shadow container p-5">
        <h1 className="mb-3">Create NFT</h1>
      <div className="col-12">
        <Input 
          placeholder="Name"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <TextArea
          placeholder="Description"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <Input
          type="file"
          name="NFT"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} alt="User NFT Upload" />
          )
        }

        <p>
          Create NFT on the following chains:
        </p>
        <Select
          mode="multiple"
          allowClear
          className="mb-3"
          style={{ width: '100%' }}
          placeholder="Select chains"
          defaultValue={Object.values(CONFIG_CHAINS).map(configChain=>configChain.CHAIN_ID)}
          onChange={handleChangeSelectedChains}
          optionLabelProp="label"
        >
          {Object.values(CONFIG_CHAINS).map (chainConfig => (
            <Option value={chainConfig.CHAIN_ID} label={chainConfig.CHAIN_NAME} key={chainConfig.CHAIN_ID}>
              {chainConfig.CHAIN_NAME}
              <img src={chainConfig.LOGO_URL} alt={chainConfig.CHAIN_NAME} width={50} />
            </Option>
          ))}
        </Select>

        {selectedChains.map(selectedChainId => {
          const chain =  new Chain({...CONFIG_CHAINS[selectedChainId]});
          return (
            <div key={chain.CHAIN_ID}>
              <Button className="center-block my-2" onClick={()=>createNFT(false, selectedChainId)}>
                Mint on {' '} {chain.getChainFullName()}
                  <img src={chain.LOGO_URL} alt={chain.CHAIN_NAME} width={25} />
              </Button>
            </div>
          )
        })}

        {Object.values(createNFTResponseMessage).filter(response=>response.message).map(response => (
         <>
           <Alert
              type={response.type}
              message={<>
              {response.message}{' '}
              {response.loading && <Spin />}
              </>
              }
              style={{maxWidth: '300px'}}
              className="mb-2"
            />
         </>
        ))}

        {createdNFTs.length > 0 && 
        <div>
          <h3>
            Created NFTs (<Link to="/my-nfts">
                        <span>View all my NFTs</span>
                    </Link>)
          </h3>
          <Row gutter={[24,24]}>
          {
            createdNFTs.map((nft, i) => {

              return(
                <Col md={8} sm={24} key={i}>
                  <NFTCard nft={nft} />
                </Col>
              )

            })
          }
        </Row>
        </div>
        
        }

        {error && <Alert
          type="error"
          message={error}
          style={{maxWidth: '300px'}}
        />}
      </div>
    </div>
  )
}

export default withRouter(CreateNFT);