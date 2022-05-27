export interface NFTMetadata {
    name: string,
    image: string,
    description: string,
    tokenId: string,
    chainId: string,
    // following properties only exist if the NFT is listed for sale
    price?: string,
    seller?: string,
    itemId?: string,
    owner?: string,
}