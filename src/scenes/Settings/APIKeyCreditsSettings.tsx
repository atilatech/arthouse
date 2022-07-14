import React, { ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useState } from 'react'
import { APIKeyCredit } from '../../models/APIKeyCredit';
import APIKeyCreditService from '../../services/APIKeyCreditService';
import { ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME } from '../../services/ServicesHelpers';

function APIKeyCreditSettings() {

  const [apiKeyCredit, setApiKeyCredit] = useState<APIKeyCredit>({public_key: localStorage.getItem(ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME) || ""});
  const [loading, setLoading] = useState("");

  const updateApiKeyCredit: ChangeEventHandler<HTMLInputElement> = (event) => {

        event.preventDefault();
        const value = event!.target!.value;
        const name = event.target.name;
        console.log("value, name, value.length", value, name, value.length)
        if (name === "public_key") {
            const updatedApiKeyCredit = {
                ...apiKeyCredit,
                [name]: value,
            }
            setApiKeyCredit(updatedApiKeyCredit);
            // a full public key has 32 characters, so fetch credit details when a full key is received
            if(value?.length >= 32) {
                localStorage.setItem(ATILA_API_CREDITS_PUBLIC_KEY_LOCAL_STORAGE_KEY_NAME, value);
            }
        }
  };



  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
        loadApiKeyCredit()
    }
};

  const loadApiKeyCredit = useCallback(
    () => {
        // a full public key has 32 characters, so fetch credit details when a full key is received
        if(apiKeyCredit.public_key?.length >= 32) {
            setLoading("Loading API key...");
            APIKeyCreditService.getAPIKeyCreditByPublicKey(apiKeyCredit.public_key)
            .then((res: any)=> {
                console.log({res});
               const { data: { results } } = res;
               if (results.length > 0) {
                   setApiKeyCredit(results[0]);
                   setLoading("");
               } else {
                setLoading("No API Key found");
               }
           })
           .catch((err: any) => {
               console.log({err});
               setLoading(err?.response?.data?.message || err.message);
           })

        }
    },
    [apiKeyCredit.public_key]
  );

    useEffect(() => {
        loadApiKeyCredit();
    }, [loadApiKeyCredit])



  return (
    <div className="APIKeyCreditSettings">
        <label htmlFor="public_key">
            API Key
        </label>
        <input value={apiKeyCredit.public_key} className="form-control mb-3" onChange={updateApiKeyCredit}
        onKeyPress={onKeyPress}
            name="public_key" placeholder={"Enter Your public key"} />

            <p>
                <a className="text-align-left" href="https://atila.ca/atlas" target="_blank" rel="noopener noreferrer">
                    Get more credits at atila.ca/atlas
                </a>
            </p>

        {!Number.isNaN(apiKeyCredit.search_credits_available) && 
            <div>
                <h3>Available Credits</h3>
                <p>
                    Search credits available: {apiKeyCredit.search_credits_available}
                </p>
            </div>
        }
        {loading && 
            <div>
                {loading}
                {loading.toLowerCase().startsWith("loading") && 
                    <div className="spinner-grow text-primary m-3" role="status">
                        <span className="sr-only"/>
                    </div>
                }
            </div>
        }

    </div>
  )
}

export default APIKeyCreditSettings