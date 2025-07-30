import React from 'react'

function MSelect({name, defaultValue, attributes, options}: {
    name: string, defaultValue: string, attributes: Record<string, any> | null, options: (string|number)[] | undefined,
}) {

    return (
        <select name={name} className='border rounded p-2' defaultValue={defaultValue as string}
            {...attributes}
        >
            {
                options?.map((opt, i) => (
                    <option key={i} value={opt} style={{backgroundColor: "#333", color: "#cdc"}}>{opt}</option>
                ))
            }
        </select>
    )

}

export default MSelect