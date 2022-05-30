import { InputNumber } from 'antd';
import { BigNumber, ethers } from 'ethers';
import React, { useState } from 'react'
import { CRYPTO_EXCHANGE_RATES_TO_USD } from './CryptoPrice';

function CryptoPriceEdit({currencySymbol, onPriceChange}: { currencySymbol: string, onPriceChange?: ({cryptoPrice, fiatPrice}: {cryptoPrice?: BigNumber, fiatPrice?: number}) => void}) {

  const [cryptoPrice, setCryptoPrice] = useState(0);
  const [fiatPrice, setFiatPrice] = useState(0);

  const USD_SYMBOL = "USD";

  const handleOnChange = (value: number, currencyChanged: string) => {

    let changedFiatPrice, changedCryptoPrice;

    if (currencyChanged === USD_SYMBOL) {
        changedFiatPrice = value;
        setFiatPrice(changedFiatPrice);
    } else {
        changedCryptoPrice = value;
    }
    if(currencySymbol in CRYPTO_EXCHANGE_RATES_TO_USD) {
        if (currencyChanged === USD_SYMBOL) {
            changedCryptoPrice = value * 1/CRYPTO_EXCHANGE_RATES_TO_USD[currencySymbol];
        } else {
            changedFiatPrice = value * CRYPTO_EXCHANGE_RATES_TO_USD[currencySymbol];
        }
    }
    if(changedFiatPrice) {
        setFiatPrice(changedFiatPrice);
    }
    
    if(changedCryptoPrice) {
        setCryptoPrice(changedCryptoPrice);
    }
    if(changedFiatPrice) {
        setFiatPrice(changedFiatPrice);
    }

    if (onPriceChange) {
        // set to fixed decimal places to prevent underlow errors
        // see: https://stackoverflow.com/a/72428872/5405197
        onPriceChange({cryptoPrice: ethers.utils.parseUnits(changedCryptoPrice?.toFixed(6) || (0).toString(), 'ether'), fiatPrice: changedFiatPrice})
    }
    
  }
  
  return (
    <div>
        <div className='mb-3'>
            <InputNumber prefix={currencySymbol} style={{ width: '100%' }} value={cryptoPrice} name={currencySymbol} onChange={value=>handleOnChange(value, currencySymbol)}/>
        </div>
         
         {currencySymbol in CRYPTO_EXCHANGE_RATES_TO_USD && 
         <div className='mb-3'>
             <InputNumber prefix={USD_SYMBOL} style={{ width: '100%' }} value={fiatPrice} name={USD_SYMBOL} 
         onChange={value=>handleOnChange(value, USD_SYMBOL)} />
         </div>
         }
         
    </div>
  )
}

export default CryptoPriceEdit