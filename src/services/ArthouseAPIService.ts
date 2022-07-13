import request from "axios";
import { NFTMetadata } from "../models/NFT";

class ArthouseAPIService {

    static apiUrl = `http://localhost:8008`;
    static ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME = 'atilaAPIKeyCredit';
    static ATILA_API_CREDITS_PUBLIC_KEY_HEADER_NAME = 'X-ATILA-API-CREDITS-PUBLIC-KEY';

    static DEFAULT_HEADERS = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer':  `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}`,
        'Origin': window.location.origin
        };

    static getHeadersWithAPIKey = () => ({
        ...ArthouseAPIService.DEFAULT_HEADERS,
        [ArthouseAPIService.ATILA_API_CREDITS_PUBLIC_KEY_HEADER_NAME]: localStorage.getItem(ArthouseAPIService.ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME)
    })
    static createNFTs = (nfts: {nfts: Array<{nft: NFTMetadata}>} ) => {

        const apiCompletionPromise = request({
            method: 'post',
            url: `${ArthouseAPIService.apiUrl}/api/v1/nft`,
            data: nfts,
            headers: ArthouseAPIService.getHeadersWithAPIKey(),
        });

        return apiCompletionPromise;
    };
}

export default ArthouseAPIService;