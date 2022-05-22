import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal';

import {
    CONFIG_CHAINS
  } from '../../config';

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import { Alert, Button, Col, Input, InputNumber, Row, Select } from 'antd'
import './CreateNFT.scss';
import NFTCard from '../../components/NFTCard';
import { NFTMetadata } from '../../models/NFT';

const { Option } = Select;

const { TextArea } = Input;

console.log({CONFIG_CHAINS});

const ipfsHostUrl = 'https://ipfs.infura.io:5001/api/v0';
const client = (ipfsHttpClient as any)(ipfsHostUrl);
// seems redundant because it doesn't add any new fields but doing this way makes it easier to add other fields in the future.
interface CreateNFTProps extends RouteComponentProps {
}

function CreateNFT(props: CreateNFTProps) {
  
  const { history } = props;
  const [fileUrl, setFileUrl] = useState<string|null>(null)
  const [formInput, updateFormInput] = useState({ price: 0, name: '', description: '' })
  const [error, setError] = useState("");
  const [selectedChains, setSelectedChains] = useState(Object.values(CONFIG_CHAINS).map(config=>config.CHAIN_ID));
  const [createdNFTs, setCreatedNFTs] = useState<NFTMetadata[]>([]);
  const [nftMetadataUrl, setNftMetadataUrl] = useState("");

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
      const { name, description, price } = formInput
      if (!name || !description || !price || !fileUrl) return
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
    console.log(`selected ${value}`);
    setSelectedChains(value);
  }

  async function mintAndListNFT(listNFT= true, activeChainId: string) {

    const url = await getNFTMetadataUrl();
    const activeChain = CONFIG_CHAINS[activeChainId];
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

      if (window.ethereum.networkVersion != activeChainId) {
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
      let contract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer)
      let mintTransactionPromise = await contract.createToken(url)
      let mintTransaction = await mintTransactionPromise.wait()
      let event = mintTransaction.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()
      const price = ethers.utils.parseUnits(formInput.price.toString(), 'ether');
      let listTransaction;

      if (listNFT) {

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
      console.log({updatedCreatedNFTs});
    
    // history.push('/');
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
        <InputNumber
          placeholder="Price"
          className="w-100"
          addonBefore="ETH"
          onChange={(value: number) => updateFormInput({ ...formInput, price: value })}
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

        <Button style={{height: "50px"}}>
            <a href="https://staging-global.transak.com/?apiKey=bec60cf8-dab5-4d3c-9f5f-fa45bc2c6514&exchangeScreenTitle=Arthouse&redirectURL=https://art.atila.ca/create" target="_blank">
            {/* <a href="https://staging-global.transak.com/?apiKey=bec60cf8-dab5-4d3c-9f5f-fa45bc2c6514&exchangeScreenTitle=Arthouse&networks=ethereum,polygon,harmony" target="_blank"> */}
                Buy Crypto with Transak
                <img src="https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F2568214732-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyKT7ulakWzij4PDiIp6U%252Ficon%252FTbk5OkyEAiidHiC1yXpm%252FsK_Kgoxa_400x400.jpeg%3Falt%3Dmedia%26token%3Dacdf28e9-2036-4d48-93ce-dbd0eb6f5714" />
            </a>
        </Button>

        <p>
          Create NFT on the following chains:
        </p>
        <Select
          mode="multiple"
          className="mb-3"
          style={{ width: '100%' }}
          placeholder="Select chains"
          defaultValue={Object.values(CONFIG_CHAINS).map(configChain=>configChain.CHAIN_ID)}
          onChange={handleChangeSelectedChains}
          optionLabelProp="label"
        >
          {Object.values(CONFIG_CHAINS).map (chainConfig => (
            <Option value={chainConfig.CHAIN_ID} label={chainConfig.NETWORK_NAME}>
              {chainConfig.CHAIN_NAME} ({chainConfig.NETWORK_NAME})
              <img src={chainConfig.LOGO_URL} alt={chainConfig.CHAIN_NAME} width={50} />
            </Option>
          ))}
        </Select>

        {selectedChains.map(selectedChainId => {
          const chainConfig = CONFIG_CHAINS[selectedChainId];
          const nftBlockExplorerUrl = `${chainConfig.BLOCK_EXPLORER_URL}/${chainConfig.CHAIN_NAME !== "Harmony" ? "token": "address"}/${chainConfig.NFT_ADDRESS}`;

          const networkFullName = `${chainConfig.CHAIN_NAME} (${chainConfig.NETWORK_NAME})`;
          return (
            <div>
              <Button className="center-block my-2" onClick={()=>createNFT(false, selectedChainId)}>
                Mint on {' '} {networkFullName}
                  <img src={chainConfig.LOGO_URL} alt={chainConfig.CHAIN_NAME} width={25} />
              </Button>
              <a href={nftBlockExplorerUrl} target="_blank" rel="noreferrer" className="center-block text-center">
                View {networkFullName} NFT Contract on Block Explorer
              </a>
            </div>
          )
        })}

        
        
        {/* <Button className="center-block" type="primary" onClick={()=>createNFT(true)}>
          Create NFT
        </Button> */}

        {createdNFTs.length > 0 && 
        <div>
          <h3>
            Created NFTs
          </h3>
          <Row gutter={[24,24]}>
          {
            createdNFTs.map((nft, i) => {

              return(
                <Col md={8} sm={24} key={i}>
                  <NFTCard nft={nft} chainId={nft.chainId} />
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