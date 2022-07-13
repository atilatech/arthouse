import request from "axios";
import { NFTMetadata } from "../models/NFT";

class ArthouseAPIService {

    static apiUrl = `http://localhost:8008`;

    static createNFTs = (nfts: Array<NFTMetadata>) => {

        const apiCompletionPromise = request({
            method: 'post',
            url: `${ArthouseAPIService.apiUrl}/api/v1/nft`,
            data: nfts,
        });

        return apiCompletionPromise;
    };
}

export default ArthouseAPIService;