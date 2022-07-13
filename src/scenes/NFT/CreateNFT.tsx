import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal';

import {
    CONFIG_CHAINS
  } from '../../config';

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import { Alert, AlertProps, Button, Col, Input, Radio, RadioChangeEvent, Row, Spin } from 'antd'
import './CreateNFT.scss';
import NFTCard from '../../components/NFTCard';
import { NFTMetadata } from '../../models/NFT';
import { Chain } from '../../models/Chain';
import { API_KEY, CLIENT_SIGNER, getCreationMode } from '../Settings/Settings';
import ArthouseAPIService from '../../services/ArthouseAPIService';

const { TextArea } = Input;

const ipfsHostUrl = 'https://ipfs.infura.io:5001/api/v0';
const client = (ipfsHttpClient as any)(ipfsHostUrl);

function CreateNFT() {
  
  const creationMode = getCreationMode();
  const [fileUrl, setFileUrl] = useState<string|null>(null)
  const [formInput, updateFormInput] = useState({ owner: '', name: '', description: '' })
  const [error, setError] = useState("");
  const [activeChainId, setActiveChainId] = useState(Object.values(CONFIG_CHAINS)[0].CHAIN_ID)
  const [createdNFTs, setCreatedNFTs] = useState<NFTMetadata[]>([]);
  const [nftMetadataUrl, setNftMetadataUrl] = useState("");
  const [createNFTResponseMessage, setCreateNFTResponseMessage] = useState<{[key: string]: {message: string, type: AlertProps["type"], loading?: boolean}}>({});


  const activeChain =  new Chain({...CONFIG_CHAINS[activeChainId]});

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

  useEffect(() => {
    
    if (window.ethereum) {
      const getAddress = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner();
        const owner = await signer.getAddress();
        updateFormInput(previousFormInput => ({ ...previousFormInput, owner }));
      }


    getAddress()
  }
  
  }, [])
  

  async function createNFT() {

    try {
      if(creationMode === API_KEY) {
        createNFTWithAPIKey();
      } else if(creationMode === CLIENT_SIGNER) {
        const tokenUri = await getNFTMetadataUrl();

        if (!tokenUri) {
          setCreateNFTResponseMessage({
            ...createNFTResponseMessage,
            [activeChain.CHAIN_ID]: {
              type: "error",
              message: "Missing NFT url data. Try reuploading your NFT or refreshing the page.",
            }
            });
            return
        }
        createNFTWithClientSigner(tokenUri);
      }
      
    } catch {
      setError(JSON.stringify(error));
    }
  }

  const handleChangeSelectedChains = (event: RadioChangeEvent) => {
    console.log('radio checked', event.target.value);
    setActiveChainId(event.target.value);
  };

  async function createNFTWithAPIKey() {

    const { name, description, owner } = formInput
    const nftRequest: NFTMetadata = {
      name, description, owner, image: fileUrl!, chainId: activeChainId, address: activeChain.NFT_ADDRESS
    }

    ArthouseAPIService.createNFTs([nftRequest])
      .then((res: any) => {
        console.log({res});
      })
      .catch((error: any) => {
        console.log({error});
      })
    
  }

  async function createNFTWithClientSigner(tokenUri: string) {
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

      /* next, create the item */
      const updatedcreateNFTResponseMessage = {...createNFTResponseMessage};
      updatedcreateNFTResponseMessage[activeChain.CHAIN_ID] = {
        message: `Minting NFT on ${activeChain.getChainFullName()}`,
        type: "info",
        loading: true,
      };
      setCreateNFTResponseMessage(updatedcreateNFTResponseMessage);
      try {

        let nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer)
        let mintTransactionPromise = await nftContract.createToken(tokenUri)
        let mintTransaction = await mintTransactionPromise.wait()
        let event = mintTransaction.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber();
  
        const { name, description } = formInput;

        const owner = await signer.getAddress();
        const createdNFT: NFTMetadata = {
          name,
          description,
          image: fileUrl || "",
          // url,
          tokenId,
          owner,
          address: activeChain.NFT_ADDRESS,
          chainId: activeChain.CHAIN_ID,
          // chain: activeChain,
          // mintTransaction,
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
        {creationMode === API_KEY && 
        <Input 
          placeholder="Destination Address"
          onChange={e => updateFormInput({ ...formInput, owner: e.target.value })}
        />}
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
        <Radio.Group onChange={handleChangeSelectedChains} value={activeChainId}>
        {Object.values(CONFIG_CHAINS).map (chainConfig => (
            <Radio value={chainConfig.CHAIN_ID} key={chainConfig.CHAIN_ID}>
              {chainConfig.CHAIN_NAME}
              <img src={chainConfig.LOGO_URL} alt={chainConfig.CHAIN_NAME} width={50} />
            </Radio>
          ))}
        </Radio.Group>
        <hr/>
        <Button className="center-block my-2" onClick={()=>createNFT()}>
                Mint on {' '} {activeChain.getChainFullName()}
                  <img src={activeChain.LOGO_URL} alt={activeChain.CHAIN_NAME} width={25} />
        </Button>

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