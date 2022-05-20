import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'

import {
    NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS
  } from '../../config';

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'
import { Button, Input, InputNumber } from 'antd'
import './CreateNFT.scss';

const { TextArea } = Input;

console.log({NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS});

const client = (ipfsHttpClient as any)('https://ipfs.infura.io:5001/api/v0');
// seems redundant because it doesn't add any new fields but doing this way makes it easier to add other fields in the future.
interface CreateNFTProps extends RouteComponentProps {
}

function CreateNFT(props: CreateNFTProps) {
  
  const { history } = props;
  const [fileUrl, setFileUrl] = useState<string|null>(null)
  const [formInput, updateFormInput] = useState({ price: 0, name: '', description: '' })

  async function onChange(e: any) {
    const file = e.target.files[0]
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
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url: string) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price.toString(), 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(NFT_MARKETPLACE_ADDRESS, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(NFT_ADDRESS, tokenId, price, { value: listingPrice })
    await transaction.wait()
    history.push('/');
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
        <Button className="center-block" type="primary" onClick={createMarket}>
          Create NFT
        </Button>
      </div>
    </div>
  )
}

export default withRouter(CreateNFT);