export interface NFTMetadata {
    name: string,
    image: string,
    description: string,
    price: string,
    tokenId: string,
    chainId: string,
    // following properties only exist if the NFT is listed for sale
    seller: string,
    itemId?: string,
    owner?: string,
}