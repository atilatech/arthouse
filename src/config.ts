// this file is auto-generated each time scripts/deploy.js is run
import configChains from './config-chains.json';
import { Chain } from './models/Chain';


export const ALL_CONFIG_CHAINS: {[key: string]: Chain} =  (configChains as any);

delete ALL_CONFIG_CHAINS.localhost;
export let CONFIG_CHAINS: {[key: string]: Chain} = {};

// if the URL starts with art.atila.ca' then only show mainnet chains
Object.values(ALL_CONFIG_CHAINS)
// comment the following line if you want to test with all chains without filtering any chains out
.filter(chain => window.location.host.startsWith('art.atila.ca') ? chain.IS_MAIN_NET : !chain.IS_MAIN_NET)
.forEach(chain => {
    CONFIG_CHAINS[chain.CHAIN_ID] = chain;
})

export const REACT_APP_MORALIS_SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
export const REACT_APP_MORALIS_APP_ID = process.env.REACT_APP_MORALIS_APP_ID;

console.log({REACT_APP_MORALIS_APP_ID, REACT_APP_MORALIS_SERVER_URL});
export const MORALIS_SUPPORTED_CHAINS = ["4", "80001", "97", "56", "137"];
