import { BigNumber } from "ethers";

export interface NFTMetadata {
    name: string,
    image: string,
    description: string,
    chainId: string,
    owner: string,
    address: string,
    // following properties only exist if the NFT has been minted
    tokenId?: string,
    tokenURI?: string,
    // following properties only exist if the NFT is listed for sale
    price?: BigNumber,
    seller?: string,
    itemId?: string,
}