import React from 'react'
import { FormItemOptionDataPair } from '../../types/uiTypes'

function MSelect({name, defaultValue, attributes, options}: {
    name: string, defaultValue: string, attributes: Record<string, any> | null, options: FormItemOptionDataPair[] | undefined,
}) {


    return (
        <select name={name} className='border rounded p-2' defaultValue={defaultValue as string}
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