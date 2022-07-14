import { Radio, RadioChangeEvent } from 'antd'
import React, { useState } from 'react'
import { prettifyString } from '../../utils/TextUtils';
import APIKeyCreditSettings from './APIKeyCreditsSettings';

export const API_KEY = "api_key";
export const CLIENT_SIGNER = "client_signer";

export const CREATION_MODES = [
    {
        value: API_KEY,
    },
    {
        value: CLIENT_SIGNER,
    },
];

export function getCreationMode() {
    return localStorage.getItem('creationMode') || CREATION_MODES[0].value;
}

function Settings() {

  const currentCreationMode = getCreationMode();
  const [creationMode, setCreationMode] = useState(currentCreationMode);

  const onChangeCreationMode = (event: RadioChangeEvent) => {
    setCreationMode(event.target.value);
    localStorage.setItem('creationMode', event.target.value);
  };

  return (
    
    <div className="container">
        <h1 className='text-center'>
            Settings
        </h1>
        <div>
            Creation Mode: {' '}

            <Radio.Group onChange={onChangeCreationMode} value={creationMode}>
                {CREATION_MODES.map(creationModeOption => (
                    <Radio value={creationModeOption.value}>{prettifyString(creationModeOption.value)}</Radio>
                ))}
            </Radio.Group>

        </div>

        <div>
            <APIKeyCreditSettings />
        </div>
        
    </div>
  )
}

export default Settings