// this file is auto-generated each time scripts/deploy.js is run
import configChains from './config-chains.json';
import { Chain } from './models/Chain';

export const activeChainId = localStorage.getItem("activeChainId") || "44787"; // default to CELO


export const CONFIG_CHAINS: {[key: string]: Chain} =  (configChains as any);

delete CONFIG_CHAINS.localhost;

export const NFT_MARKETPLACE_ADDRESS = CONFIG_CHAINS[activeChainId].NFT_MARKETPLACE_ADDRESS;
export const NFT_ADDRESS = CONFIG_CHAINS[activeChainId].NFT_ADDRESS;

export const REACT_APP_MORALIS_SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
export const REACT_APP_MORALIS_APP_ID = process.env.REACT_APP_MORALIS_APP_ID;


export const MORALIS_SUPPORTED_CHAINS = ["4", "80001", "97", "56"];


// TODO change this to a dictionary where each marketplace is a key with a SUPPORTED_CHAINS key
export const OPENSEA_SUPPORTED_CHAINS = ["4", "80001", "97"];
export const RARIBLE_SUPPORTED_CHAINS = ["4"];
export const LOOKSRARE_SUPPORTED_CHAINS = ["4"];