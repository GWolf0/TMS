import React from 'react'
import { FormItemOptionDataPair } from '../../types/uiTypes'

function MSelect({name, defaultValue, attributes, options, onChanged}: {
    name: string, defaultValue: string, attributes?: Record<string, any> | null | undefined,
    options: FormItemOptionDataPair[] | undefined, onChanged?: (value: string) => any,
}) {

    function onChange(value: string) {
        if(onChanged) onChanged(value);
    }

    return (
        <select name={name} className='border rounded p-2 md:text-sm text-xs' defaultValue={defaultValue as string} 
            onChange={(e) => onChange(e.target.value)}
        {...attributes}
        >
            {
                options?.map((opt, i) => (
                    <option key={i} value={opt.id} style={{backgroundColor: "#333", color: "#cdc"}}>{opt.label}</option>
                ))
            }
        </select>
    )

}

export default MSelect