import React, { useEffect, useMemo, useState } from 'react'
import { FormItemDef } from '../../../types/uiTypes';
import ModalService from '../../../services/ModalService';
import FormFKChooserModal, { FK_FORM_MODAL_CHOOSER_ID } from '../../customModals/FormFKChooserModal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import MSelect from '../../ui/MSelect';
import FormFKItem from './FormFKItem';
import { JSONType } from '../../../types/common';

function FormCompItem({item, defaultValue, fkLabel, inputProps}: {
    item: FormItemDef, defaultValue: string | number | boolean | undefined, fkLabel: string | undefined, inputProps?: JSONType,
}) {
    if(defaultValue === "N/A") defaultValue = undefined;
    inputProps = inputProps ?? undefined;

    switch(item.type){
        case "hidden":
            return (
                <Input
                    name = {item.name}
                    type = 'hidden'
                    defaultValue = {item.meta?.hiddenValAuto ? String(defaultValue) : item.meta?.hiddenVal}
                    {...inputProps}
                />
            )
        case "text":
            return (
                <Input
                    name = {item.name}
                    placeholder = {item.displayName}
                    defaultValue={defaultValue as string}
                    {...inputProps}
                />
            )
        case "number":
            return (
                <Input
                    name = {item.name}
                    type = 'number'
                    placeholder = {item.displayName}
                    defaultValue={defaultValue as number}
                    {...inputProps}
                />
            )
        case "boolean":
            return (
                <div className='flex gap-2'>
                    <label htmlFor={item.name}>{ item.displayName }</label>
                    <input 
                        className='accent-primary'
                        name = {item.name}
                        type = 'checkbox'
                        defaultChecked={defaultValue as boolean}
                        {...inputProps}
                    />
                </div>
            )
        case "options":
            return (
                <MSelect 
                    name={item.name}
                    defaultValue={defaultValue as string}
                    options={item.meta?.optionsData}
                    attributes={inputProps}
                />
            )
        case "date":
            return (
                <Input
                    name = {item.name}
                    type = "date"
                    defaultValue={defaultValue as string}
                    {...inputProps}
                />
            )
        case "time":
            return (
                <Input 
                    name = {item.name}
                    type = "time"
                    defaultValue={defaultValue as string}
                    {...inputProps}
                />
            )
        case "fk":
            return (
                <FormFKItem item={item} id={Number(defaultValue)} 
                    label={fkLabel} 
                />
            )
        default:
            return <div>Unsupported field type: {item.type}</div>;
    }

}

export default FormCompItem

// formCSVInput
// handles inputs of csv format, allow add remove of items
// function FormCSVItem({item, dataStr, separator}: {
//     item: FormItemDef, dataStr?: string, separator?: string,
// }){
//     dataStr = dataStr || "";
//     separator = separator || ",";
//     const minCount: number = useMemo(() => item.meta?.csvMinCount || 0, [item]);
//     const maxCount: number = useMemo(() => item.meta?.csvMaxCount || 100, [item]);
//     const [data, setData] = useState<string[]>(dataStr.split(separator));

//     function onNewItem(){
//         setData(prev => [...prev, ""]);
//     }

//     function onRemoveItem(idx: number){
//         setData(prev => prev.filter((_, i) => i !== idx));
//     }

//     // compute actual input value
//     function getInputValue(): string{
//         return data.slice(Math.min(data.length, maxCount)).join(separator);
//     }

//     return (
//         <div className='flex flex-col gap-4 border p-2'>
//             {/* // actual input */}
//             <input name={item.name} type='hidden' value={getInputValue()} />

//             {/* // list of items */}
//             <ul className='w-full flex flex-col gap-2'>
//                 {
//                     data.map((d, i) => (
//                         <li key={i} className='relative flex items-center py-2 pr-8'>
//                             {_renderFormItem(item, d)}

//                             {/* // remove btn */}
//                             {data.length -1 >= minCount &&
//                                 <Button className='absolute right-2 top-2 p-2' size={"sm"} variant={"ghost"} onClick={()=>onRemoveItem(i)}>
//                                     <i className='bi bi-x-lg'></i>
//                                 </Button>
//                             }
//                         </li>
//                     ))
//                 }
//             </ul>

//             {/* // add btn */}
//             {data.length < maxCount && 
//                 <Button className='w-full' onClick={onNewItem}><i className='bi bi-plus-lg'></i> Add</Button>
//             }
//         </div>
//     )

// }