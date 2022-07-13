import { Radio, RadioChangeEvent } from 'antd'
import React, { useState } from 'react'
import { prettifyString } from '../../utils/TextUtils';

export const CREATION_MODES = [
    {
        value: "api_key",
    },
    {
        value: "client_signer",
    },
];

function Settings() {

    const currentCreationMode = localStorage.getItem('creationMode') || CREATION_MODES[0].value;
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
        
    </div>
  )
}

export default Settings