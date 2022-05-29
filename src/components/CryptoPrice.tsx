import { BigNumber, ethers } from 'ethers';
import React from 'react'

// TODO get this dynamically from an exchange via API and cache to local storage
export const CRYPTO_EXCHANGE_RATES_TO_USD: {[key: string]: number} = {
  BNB: 307.08,
  ETH: 1791.77,
  MATIC: 0.5873,
}

export const formatCurrency = (input : number, currency = "USD", convertToInteger= false) => {
  let minimumFractionDigits = 2;
  if (convertToInteger) {
      input = Math.round(input);
      minimumFractionDigits = 0;
  }
  
  if (currency in CRYPTO_EXCHANGE_RATES_TO_USD) {
      return `${currency} ${input.toFixed(6)}`
  }
  return input.toLocaleString('en-ca', {style : 'currency', currency, minimumFractionDigits });
}

function CryptoPrice({cryptoPrice, currencySymbol}: {cryptoPrice: BigNumber, currencySymbol: string}) {
  
  const cryptoPriceFormatted = formatCurrency(Number.parseFloat(ethers.utils.formatEther(cryptoPrice)), currencySymbol); 
  let usdPriceFormatted = "";
  if (currencySymbol in CRYPTO_EXCHANGE_RATES_TO_USD) {
    const cryptoPriceInDecimal = Number.parseFloat(ethers.utils.formatEther(cryptoPrice)) * CRYPTO_EXCHANGE_RATES_TO_USD[currencySymbol]
    usdPriceFormatted = formatCurrency(cryptoPriceInDecimal, "USD");
    console.log({cryptoPrice, currencySymbol, cryptoPriceInDecimal});
  }

  return (
    <div>
      {cryptoPriceFormatted} {usdPriceFormatted && <label>({usdPriceFormatted})</label>}
    </div>
  )
}

export default CryptoPrice