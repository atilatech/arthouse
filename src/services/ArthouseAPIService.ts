import request from "axios";
import { NFTMetadata } from "../models/NFT";
import Environment from "./Environment";
import { ServicesHelpers } from "./ServicesHelpers";

class ArthouseAPIService {

    static createNFTs = (nfts: {nfts: Array<{nft: NFTMetadata}>} ) => {

        const headers = ServicesHelpers.getHeaders({addAPIKey: true});
        const apiCompletionPromise = request({
            method: 'post',
            url: `${Environment.arthouseApiUrl}/v1/nft`,
            data: nfts,
            headers,
        });

        return apiCompletionPromise;
    };
}

export default ArthouseAPIService;