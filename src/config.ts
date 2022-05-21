// this file is auto-generated each time scripts/deploy.js is run
import configChains from './config-chains.json';

export const activeChainId = localStorage.getItem("activeChainId") || "localhost";

export const CONFIG_CHAINS =  (configChains as any);

export const NFT_MARKETPLACE_ADDRESS = CONFIG_CHAINS[activeChainId].NFT_MARKETPLACE_ADDRESS;
export const NFT_ADDRESS = CONFIG_CHAINS[activeChainId].NFT_ADDRESS;
