// this file is auto-generated each time scripts/deploy.js is run
import configChains from './config-chains.json';

const activeChainId = localStorage.getItem("activeChainId") || "localhost";

export const NFT_MARKETPLACE_ADDRESS = (configChains as any)[activeChainId].NFT_MARKETPLACE_ADDRESS;
export const NFT_ADDRESS = (configChains as any)[activeChainId].NFT_ADDRESS;